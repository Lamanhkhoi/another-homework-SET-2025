import http from 'http';
import router from './router.mjs'
const requestHandler = (request, response) => {
    response.setHeader('Content-Type', 'application/json; charset=utf-8');
    router(request, response);
};

const server = http.createServer(requestHandler);
const PORT = 3000;

server.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
    console.log('API sum: /sum?num1=X&num2=Y');
});
