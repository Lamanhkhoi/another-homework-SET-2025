const http = require('http');
const hostname = '127.0.0.1';
const PORT = 3000;

const server = http.createServer((require, response) => {
    response.statusCode = 200;
    response.setHeader('Content-Type', 'text/html; charset=utf-8');
    response.end('<h1>Xin chào mọi người !!!</h1>');
});

server.listen(PORT, hostname, () => {
    console.log(`Server dang chay tai http://${hostname}:${PORT}/`);
});

