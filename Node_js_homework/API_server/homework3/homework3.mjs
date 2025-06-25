import http from 'http';
import url from 'url';
import { HTTP_STATUS, ROUTES, HEADERS, MESSAGES, VIETNAM_TIME_OPTIONS } from './constants.mjs';

const requestHandler = (request, response) => {
    const parsedUrl = url.parse(request.url, true);
    const pathname = parsedUrl.pathname;
    const method = request.method;

    console.log(`Request received: ${method} ${pathname}`);
    
    response.setHeader(HEADERS.CONTENT_TYPE, HEADERS.APP_JSON_UTF8);

    if (pathname === ROUTES.TIME && method === 'GET'){
        const now = new Date();
        
        const dateTimeParts = now.toLocaleString('sv-SE', VIETNAM_TIME_OPTIONS); 

        const formattedVietnamTime = dateTimeParts.replace(' ', '/') + "+07:00";

        response.writeHead(HTTP_STATUS.OK);
        response.end(JSON.stringify({
            currentTime: formattedVietnamTime
        }));

    } else {
        response.writeHead(HTTP_STATUS.NOT_FOUND);
        response.end(JSON.stringify({
            error: MESSAGES.ENDPOINT_NOT_FOUND
        }))
    }
};

const server = http.createServer(requestHandler);
const PORT = 3000;

server.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
    console.log(`Test GET request to: /current-time-vietnam`);
});
