import http from 'http';
import { URL } from 'url';
import mainRouter from './routers/index.mjs';

const requestHandler = (request, response) => {
    response.setHeader('Content-Type', 'application/json; charset=utf-8');

    mainRouter(request, response);
};

const server = http.createServer(requestHandler);
const PORT = 3001;

server.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
    console.log('API sum: GET /sum?num1=X&num2=Y');
});
