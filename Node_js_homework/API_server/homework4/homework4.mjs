import http from 'http';
import url from 'url';
import { HTTP_STATUS, ROUTES, HTTP_METHODS, HEADERS, MESSAGES, VIETNAM_TIME_OPTIONS } from './constants.mjs';

let sumAPICallCount = 0;
let apiCallHistory = [];

const requestHandler = (request, response) => {
    const parsedUrl = url.parse(request.url, true);
    const pathname = parsedUrl.pathname;
    const method = request.method;
    const queryParams = parsedUrl.query;

    console.log(`Request received: ${method} ${pathname}`);

    response.setHeader(HEADERS.CONTENT_TYPE, HEADERS.APP_JSON_UTF8);

    if (pathname === ROUTES.SUM && method === HTTP_METHODS.GET) {
        const num1str = queryParams.num1;
        const num2str = queryParams.num2;
        const num1 = parseFloat(num1str);
        const num2 = parseFloat(num2str);

        if (isNaN(num1) || isNaN(num2)) {
            response.writeHead(HTTP_STATUS.BAD_REQUEST);
            response.end(JSON.stringify({
                error: MESSAGES.INVALID_INPUT
            }));
        } else {
            const sumResult = num1 + num2;
            sumAPICallCount++;

            const historyEntry = {
                endpoint: ROUTES.SUM,
                input: { num1: num1, num2: num2 },
                output: { sum: sumResult },
                timestamp: new Date().toISOString()
            };
            apiCallHistory.push(historyEntry);
            console.log(`History logged for ${ROUTES.SUM}. Number of history entries:`, apiCallHistory.length);

            response.writeHead(HTTP_STATUS.OK);
            response.end(JSON.stringify({
                sum: sumResult,
                num1_received: num1,
                num2_received: num2
            }));
        }
    } else if (pathname === ROUTES.TIME && method === HTTP_METHODS.GET) {
        const now = new Date();
        const dateTimeParts = now.toLocaleString('sv-SE', VIETNAM_TIME_OPTIONS);
        const formattedVietnamTime = dateTimeParts.replace(' ', 'T') + "+07:00";

        const historyEntry = {
            endpoint: ROUTES.TIME, 
            input: {},
            output: { currentTime: formattedVietnamTime },
            timestamp: new Date().toISOString()
        };
        apiCallHistory.push(historyEntry);
        console.log(`History has been logged for ${ROUTES.TIME}. Number of history entries:`, apiCallHistory.length);

        response.writeHead(HTTP_STATUS.OK);
        response.end(JSON.stringify({
            currentTime: formattedVietnamTime
        }));

    } else if (pathname === ROUTES.HISTORY && method === HTTP_METHODS.GET) {
        response.writeHead(HTTP_STATUS.OK);
        response.end(JSON.stringify({
            history: apiCallHistory
        }));
    } else {
        response.writeHead(HTTP_STATUS.NOT_FOUND);
        response.end(JSON.stringify({
            error: MESSAGES.ENDPOINT_NOT_FOUND
        }));
    }
};

const server = http.createServer(requestHandler);
const PORT = 3000;

server.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
    console.log('API time: /current-time-vietnam');
    console.log('API sum: /sum?num1=X&num2=Y');
    console.log('API count api /sum had succeed: /sum/call-count (GET)');
    console.log('API history: /history');
});