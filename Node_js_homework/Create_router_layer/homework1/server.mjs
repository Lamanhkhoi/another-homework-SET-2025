import http from 'http';
import { URL } from 'url';
import sumRouter from './routers/sum_router.mjs'

function handleMainNotFound(request, response) {
    response.writeHead(404);
    response.end(JSON.stringify({ error: "Endpoint not found." }));
}

const requestHandler = (request, response) => {
    response.setHeader('Content-Type', 'application/json; charset=utf-8');

    const url = new URL(request.url, `http://${request.headers.host}`);
    const { pathname } = url;

    console.log(`Router accept request: ${pathname}`);

    if (pathname.startsWith('/sum')) {
        sumRouter(request, response);
    } else {
        handleMainNotFound(request, response);
    }
};

const server = http.createServer(requestHandler);
const PORT = 3000;

server.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
    console.log('API sum: GET /sum?num1=X&num2=Y');
});
