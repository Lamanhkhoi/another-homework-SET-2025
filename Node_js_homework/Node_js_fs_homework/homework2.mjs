import http from 'http';
import url from 'url';
import fs from 'fs/promises';
import path from 'path';

import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const historyFilePath = path.join(__dirname, 'sum_history_homework2.txt');
const countFilePath = path.join(__dirname, 'sum_count.txt');
let sumAPICallCount = 0;

const requestHandler = async (requestFromClient, responseToClient) => {
    // Phân tích URL từ đối tượng 'requestFromClient'
    const parsedUrl = url.parse(requestFromClient.url, true); 
    const pathname = parsedUrl.pathname;
    const queryParams = parsedUrl.query;

    responseToClient.setHeader('Content-Type', 'application/json; charset=utf-8');

    if (pathname === '/sum') {
        const num1str = queryParams.num1;
        const num2str = queryParams.num2;

        console.log('Đã nhận được num1 (chuỗi):', num1str);
        console.log('Đã nhận được num2 (chuỗi):', num2str);

        const num1 = parseFloat(num1str);
        const num2 = parseFloat(num2str);
        console.log(`Sau khi parseFloat: num1 = ${num1} (kiểu: ${typeof num1}), num2 = ${num2} (kiểu: ${typeof num2})`);

        
        if (isNaN(num1) || isNaN(num2)) {
            responseToClient.writeHead(400);
            responseToClient.end(JSON.stringify({
                error: "Dữ liệu đầu vào không hợp lệ. 'num1' và 'num2' phải là các số hợp lệ."
            }));
        } else {
            console.log(`API /sum được gọi thành công`);
            const sumResult = num1 + num2;
            const historyLine = `Timestamp: ${new Date().toISOString()}, Calculation: ${num1} + ${num2} = ${sumResult}\n`;
        
            try {
                await fs.appendFile(historyFilePath, historyLine);
                console.log('Đã ghi lịch sử phép tính vào file.');
                await fs.writeFile(countFilePath, sumAPICallCount.toString());
                console.log('Đã cập nhật file đếm.');
            } catch (error) {
                console.error('Lỗi khi ghi file lịch sử:', error);
            }
            sumAPICallCount++;
            responseToClient.writeHead(200); 
            responseToClient.end(JSON.stringify({
                sum: sumResult,
                num1_received: num1,
                num2_received: num2
            }));
            
        }
    } else if (pathname === '/sum/call-count'){
        if ( requestFromClient.method === 'GET'){
            responseToClient.writeHead(200);
            responseToClient.end(JSON.stringify({
                totalCalls: sumAPICallCount
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

const startServer = async () => {
    try {
        const data = await fs.readFile(countFilePath, 'utf8');
        sumAPICallCount = parseInt(data, 10) || 0; // Thêm || 0 để phòng trường hợp file rỗng
        console.log(`Đã nạp số lần gọi từ file: ${sumAPICallCount}`);
    } catch (error) {
        if (error.code === 'ENOENT') {
            console.log('File đếm không tìm thấy. Bắt đầu đếm từ 0.');
            sumAPICallCount = 0;
        } else {
            console.error('Lỗi khi đọc file đếm:', error);
            process.exit(1);
        }
    }

    server.listen(PORT, () => {
        console.log(`Server đang chạy tại http://localhost:${PORT}`);
        console.log('  API tính tổng: /sum?num1=X&num2=Y');
        console.log('  API đếm số lần gọi thành công: /sum/call-count (GET)');
    });
};

startServer();// "bắt đầu ngày làm việc mới"