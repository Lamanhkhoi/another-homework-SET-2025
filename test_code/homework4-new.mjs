// pure_server.mjs
// Sử dụng ES Module imports
import http from 'http';
import { parse as urlParse } from 'node:url'; // Import cụ thể hàm parse từ module 'url'

// 1. Nơi lưu trữ lịch sử (Mảng trong bộ nhớ)
const apiHistory = [];
const MAX_HISTORY_ITEMS = 100; // Giới hạn số lượng mục lịch sử (tùy chọn)

// 2. Hàm tiện ích để ghi log một lời gọi API
function recordApiCall(endpoint, method, input, output, statusCode) {
    const historyEntry = {
        timestamp: new Date().toISOString(),
        endpoint: endpoint,
        method: method,
        input: input || {}, // Đảm bảo input luôn là một object
        output: output || {}, // Đảm bảo output luôn là một object
        statusCode: statusCode
    };

    if (apiHistory.length >= MAX_HISTORY_ITEMS) {
        apiHistory.shift(); // Xóa mục cũ nhất nếu vượt quá giới hạn
    }
    apiHistory.push(historyEntry);
    // console.log(`Logged: ${method} ${endpoint} - Status: ${statusCode}`); // Để debug
}

// 3. Tạo HTTP Server
const server = http.createServer((req, res) => {
    // Phân tích URL, bao gồm cả query string (tham số true)
    // Sử dụng new URL API hiện đại hơn nếu có thể, nhưng urlParse vẫn hoạt động
    const parsedUrl = urlParse(req.url, true);
    const pathName = parsedUrl.pathname; // Đường dẫn, ví dụ: /sum, /current-time
    const method = req.method; // GET, POST, ...

    let requestBodyChunks = []; // Mảng để lưu các chunk của request body

    req.on('error', (err) => {
        // Xử lý lỗi của request stream
        console.error('Request error:', err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Server request error' }));
    });

    req.on('data', (chunk) => {
        requestBodyChunks.push(chunk); // Thu thập các phần của body
    });

    // Khi đã nhận toàn bộ request body (hoặc không có body với GET)
    req.on('end', () => {
        const rawRequestBody = Buffer.concat(requestBodyChunks).toString();
        let parsedRequestBody = {}; // Dùng để lưu body đã parse (nếu là JSON)
        let inputForLog = {}; // Dùng để lưu input cho việc ghi log

        // Chuẩn bị input cho log từ query và body
        if (parsedUrl.query && Object.keys(parsedUrl.query).length > 0) {
            inputForLog.query = parsedUrl.query;
        }

        if ((method === 'POST' || method === 'PUT') && rawRequestBody) {
            try {
                // Giả định body của POST/PUT là JSON
                parsedRequestBody = JSON.parse(rawRequestBody);
                inputForLog.body = parsedRequestBody;
            } catch (e) {
                // Nếu body không phải JSON hoặc JSON không hợp lệ
                inputForLog.body = { error: "Malformed JSON or non-JSON body", raw: rawRequestBody.substring(0, 100) + (rawRequestBody.length > 100 ? "..." : "") };
                // parsedRequestBody sẽ là object rỗng, các API cần kiểm tra input cẩn thận
            }
        }

        // --- ROUTING ĐƠN GIẢN ---

        // API: /sum
        if (pathName === '/sum' && method === 'POST') {
            let outputData, statusCode;
            const { num1, num2 } = parsedRequestBody; // Lấy từ body đã parse

            if (typeof num1 !== 'number' || typeof num2 !== 'number') {
                statusCode = 400; // Bad Request
                outputData = { error: "Invalid input. num1 and num2 must be numbers." };
            } else {
                statusCode = 200; // OK
                outputData = { sum: num1 + num2 };
            }

            res.writeHead(statusCode, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(outputData));
            recordApiCall(pathName, method, inputForLog, outputData, statusCode);

        } else if (pathName === '/current-time' && method === 'GET') {
            // API: /current-time
            const now = new Date();
            // Chuyển sang giờ Việt Nam (GMT+7) - hiện tại là 17:55 16/05/2025
            const vietnamDate = new Date(now.getTime() + (7 * 60 * 60 * 1000));
            const year = vietnamDate.getUTCFullYear();
            const month = String(vietnamDate.getUTCMonth() + 1).padStart(2, '0');
            const day = String(vietnamDate.getUTCDate()).padStart(2, '0');
            const hours = String(vietnamDate.getUTCHours()).padStart(2, '0');
            const minutes = String(vietnamDate.getUTCMinutes()).padStart(2, '0');
            const seconds = String(vietnamDate.getUTCSeconds()).padStart(2, '0');
            const currentTimeString = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}+07:00`;

            const outputData = { currentTime: currentTimeString };
            const statusCode = 200;

            res.writeHead(statusCode, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(outputData));
            recordApiCall(pathName, method, inputForLog, outputData, statusCode);

        } else if (pathName === '/api-history' && method === 'GET') {
            // API: /api-history
            const outputData = { history: [...apiHistory].reverse() }; // Trả về bản sao, mới nhất trước
            const statusCode = 200;

            res.writeHead(statusCode, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(outputData));
            // Không ghi log cho chính API /api-history

        } else {
            // Trường hợp không tìm thấy endpoint
            const outputData = { error: 'Not Found' };
            const statusCode = 404;

            res.writeHead(statusCode, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(outputData));
            // Ghi log cả những request không hợp lệ này
            recordApiCall(pathName, method, inputForLog, outputData, statusCode);
        }
    });
});

const PORT = 3001; // Chọn một port khác nếu 3000 đang được sử dụng
server.listen(PORT, () => {
    console.log(`Pure Node.js server (ESM) running on http://localhost:${PORT}`);
    console.log(`API history available at http://localhost:${PORT}/api-history`);
});

// Nếu bạn muốn export server (ví dụ để test), bạn có thể làm:
// export default server; // Hoặc export { server };
// Nhưng để chạy trực tiếp thì không cần export.