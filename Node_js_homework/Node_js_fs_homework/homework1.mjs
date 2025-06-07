import http from 'http';
import url from 'url';
import fs from 'fs/promises';
import path from 'path';

import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const historyFilePath = path.join(__dirname, 'sum_history_homework1.txt');

const requestHandler = async (requestFromClient, responseToClient) => {
    const parsedUrl = url.parse(requestFromClient.url, true);
    const pathname = parsedUrl.pathname;
    const queryParams = parsedUrl.query;

    responseToClient.setHeader('Content-Type', 'application/json; charset=utf-8');

    if (pathname === '/sum') {
        const num1str = queryParams.num1;
        const num2str = queryParams.num2;
        const num1 = parseFloat(num1str);
        const num2 = parseFloat(num2str);

        if (isNaN(num1) || isNaN(num2)) {
            responseToClient.writeHead(400);
            responseToClient.end(JSON.stringify({
                error: "Dữ liệu đầu vào không hợp lệ. 'num1' và 'num2' phải là các số hợp lệ."
            }));
        } else {
            const sumResult = num1 + num2;
            const historyLine = `Timestamp: ${new Date().toISOString()}, Calculation: ${num1} + ${num2} = ${sumResult}\n`;

            try {
                // Lệnh ghi file vẫn ở đây
                await fs.appendFile(historyFilePath, historyLine);
                console.log('Đã ghi lịch sử phép tính vào file.');
            } catch (error) {
                console.error('Lỗi khi ghi file lịch sử:', error);
            }
            responseToClient.writeHead(200);
            responseToClient.end(JSON.stringify({
                sum: sumResult,
                num1_received: num1,
                num2_received: num2
            }));
        }
    } else {
        responseToClient.writeHead(404);
        responseToClient.end(JSON.stringify({
            error: "Endpoint không tìm thấy. Hãy thử /sum?num1=X&num2=Y"
        }));
    }
};

const server = http.createServer(requestHandler);
const PORT = 3000;

server.listen(PORT, () => {
    console.log(`Server đang chạy tại http://localhost:${PORT}`);
    console.log('  API tính tổng: /sum?num1=X&num2=Y');
});
