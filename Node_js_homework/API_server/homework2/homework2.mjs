import http from 'http';
import url from 'url';
import { HTTP_STATUS, ROUTES, HEADERS, MESSAGES } from './constants.mjs';

let sumAPICallCount = 0;

const requestHandler = (requestFromClient, responseToClient) => {
    const parsedUrl = url.parse(requestFromClient.url, true); 
    const pathname = parsedUrl.pathname;
    const queryParams = parsedUrl.query;

    responseToClient.setHeader(HEADERS.CONTENT_TYPE, HEADERS.APP_JSON_UTF8);

    if (pathname === ROUTES.SUM) {
        const num1str = queryParams.num1;
        const num2str = queryParams.num2;

        console.log('Received num1 (String):', num1str);
        console.log('Received num2 (String):', num2str);

        const num1 = parseFloat(num1str);
        const num2 = parseFloat(num2str);
        console.log(`ParseFloat: num1 = ${num1} (type: ${typeof num1}),
                                 num2 = ${num2} (type: ${typeof num2})`);

        if (isNaN(num1) || isNaN(num2)) {
            responseToClient.writeHead(HTTP_STATUS.BAD_REQUEST); 
            responseToClient.end(JSON.stringify({
                error: MESSAGES.INVALID_INPUT
            }));
        } else {
            console.log(`API /sum is success. sum call-count: ${sumAPICallCount}`);
            const sumResult = num1 + num2;
            responseToClient.writeHead(HTTP_STATUS.OK); 
            responseToClient.end(JSON.stringify({
                sum: sumResult,
                num1_received: num1,
                num2_received: num2
            }));
            sumAPICallCount++;
        }
    } else if (pathname === ROUTES.CALL_COUNT){
        if ( requestFromClient.method === 'GET'){
            responseToClient.writeHead(200);
            responseToClient.end(JSON.stringify({
                totalCalls: sumAPICallCount
            }));
        }
    } else {
        responseToClient.writeHead(HTTP_STATUS.NOT_FOUND);
        responseToClient.end(JSON.stringify({
            error: MESSAGES.ENDPOINT_NOT_FOUND
        }));
    }
};

const server = http.createServer(requestHandler);
const PORT = 3000; 

server.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
    console.log('API sum: /sum?num1=X&num2=Y');
    console.log('API count api /sum had succeed: /sum/call-count (GET)');
});