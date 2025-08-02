const http = require('http');

// 2. Tạo một server
const server = http.createServer((req, res) => {
  // Kiểm tra nếu request đến đúng endpoint mà chúng ta muốn test
  if (req.url === '/stress') {
    console.log('Bắt đầu xử lý request nặng...');

    // 3. ĐÂY LÀ ĐIỂM NGHẼN (BOTTLENECK)!!!
    // Giả lập một tác vụ tính toán rất nặng, làm block Event Loop.
    // Vòng lặp này sẽ khiến CPU phải làm việc cật lực.
    let total = 0;
    for (let i = 0; i < 50_000_000; i++) {
      total++;
    }

    // 4. Khi đã tính toán xong, server mới có thể trả về response
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      message: 'Request xử lý xong!',
      total: total
    }));
    console.log('Đã xử lý xong!');
  } else {
    // Các request đến endpoint khác sẽ được xử lý bình thường
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Hello World!' }));
  }
});

// 5. Server lắng nghe ở port 3000
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
  console.log(`Endpoint để stress test: http://localhost:${PORT}/stress`);
});
