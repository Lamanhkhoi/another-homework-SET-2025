/* 
- **Requirements**:
  - Create an API that takes two numbers and returns their sum.
  - Handle cases where the user inputs invalid data (e.g., entering characters instead of numbers).
- **Input**:
  - num1: The first number (Number).
  - num2: The second number (Number).
- **Output**:
  - Returns the sum of the two numbers:{ "sum": num1 + num2 }.
  - If the input is invalid, return an error:{ "error": "Invalid input" }.
*/
import http from 'http';
import url from 'url';

const requestHandler = (requestFromClient, responseToClient) => {
    // Phân tích URL từ đối tượng 'requestFromClient'
    const parsedUrl = url.parse(requestFromClient.url, true); // Sử dụng requestFromClient.url, chứa toàn bộ thông tin URL đã được "bóc tách" thành các phần nhỏ.
    const pathname = parsedUrl.pathname;//giúp chúng ta xác định xem người dùng muốn truy cập "endpoint" nào của API.(vd: /sum, /history)
    const queryParams = parsedUrl.query;//giúp chúng ta dễ dàng lấy ra các giá trị đầu vào mà người dùng gửi lên qua URL để API xử lý

    // Sử dụng 'responseToClient' để thiết lập header
    responseToClient.setHeader('Content-Type', 'application/json; charset=utf-8');

    if (pathname === '/sum') {
        const num1str = queryParams.num1;
        const num2str = queryParams.num2;

        console.log('Đã nhận được num1 (chuỗi):', num1str);
        console.log('Đã nhận được num2 (chuỗi):', num2str);

        const num1 = parseFloat(num1str);
        const num2 = parseFloat(num2str);
        console.log(`Sau khi parseFloat: num1 = ${num1} (kiểu: ${typeof num1}), num2 = ${num2} (kiểu: ${typeof num2})`);

        // Bây giờ mới kiểm tra isNaN TRƯỚC KHI gửi bất kỳ phản hồi nào cho endpoint /sum
        if (isNaN(num1) || isNaN(num2)) {
            // Input không hợp lệ
            responseToClient.writeHead(400); // 400 Bad Request
            responseToClient.end(JSON.stringify({
                error: "Dữ liệu đầu vào không hợp lệ. 'num1' và 'num2' phải là các số hợp lệ."
            }));
        } else {
            // Input hợp lệ, tính tổng và gửi kết quả
            const sumResult = num1 + num2;
            responseToClient.writeHead(200); // 200 OK
            responseToClient.end(JSON.stringify({
                sum: sumResult,
                num1_received: num1, 
                num2_received: num2
            }));
        }
        // Không còn response.end() ở giữa logic nữa
    } else {
        // Sử dụng 'responseToClient' để gửi lỗi 404
        responseToClient.writeHead(404);
        responseToClient.end(JSON.stringify({
            error: "Endpoint không tìm thấy. Hãy thử /sum?num1=X&num2=Y"
        }));
    }
};

const server = http.createServer(requestHandler);
const PORT = 3000; // Viết hoa hằng số

server.listen(PORT, () => {
    console.log(`Server đang chạy tại http://localhost:${PORT}`); // Sửa lỗi đánh máy
    console.log('  API tính tổng: /sum?num1=X&num2=Y');
});