import http from 'http';

// Sửa thứ tự tham số: request (hoặc req) trước, response (hoặc res) sau
const server = http.createServer((request, response) => {
    // Sửa Content-Type thành 'text/plain'
    response.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' }); // Thêm charset=utf-8 để hỗ trợ tiếng Việt

    // Sửa thông báo
    response.end('Server is running!!!');
});

// Sửa tên hằng số PORT
const PORT = 3000;

server.listen(PORT, () => {
    // Sửa thông báo console
    console.log(`Server is listening on port ${PORT}`);
    console.log(`Access it at: http://localhost:${PORT}`);
});