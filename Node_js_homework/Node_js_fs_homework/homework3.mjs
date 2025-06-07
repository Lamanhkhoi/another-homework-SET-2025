import http from 'http';
import url from 'url';
import fs from 'fs/promises'; 
import path from 'path';     

import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const timeLogFilePath = path.join(__dirname, 'time_log.txt');

const requestHandler = async (request, response) => {
    const parsedUrl = url.parse(request.url, true);
    const pathname = parsedUrl.pathname;
    const method = request.method;

    console.log(`Nhận yêu cầu: ${method} ${pathname}`);
    
    response.setHeader('Content-Type', 'application/json; charset=utf-8');

    if (pathname === '/current-time-vietnam' && method === 'GET'){
        const now = new Date();
        const option = {
            timeZone: 'Asia/Ho_Chi_Minh',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false //sử dụng định dạng 24 giờ
        }
        
        const dateTimeParts = now.toLocaleString('sv-SE', option); 

        const formattedVietnamTime = dateTimeParts.replace(' ', 'T') + "+07:00";

        const logEntry = `[${new Date().toISOString()}] API /current-time-vietnam was called. Returned time: ${formattedVietnamTime}\n`;
        
        try {
            await fs.appendFile(timeLogFilePath, logEntry);
            console.log('Đã ghi log cho API thời gian.');
        } catch (error) {
            console.error('Lỗi khi ghi file log thời gian:', error);
        }

        response.writeHead(200);
        response.end(JSON.stringify({
            currentTime: formattedVietnamTime
        }));

    } else {
        response.writeHead(404);
        response.end(JSON.stringify({
            error: "Endpoint không tìm thấy."
        }));
    }
};

const server = http.createServer(requestHandler);
const PORT = 3000;

server.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
    console.log(`Test GET request to: /current-time-vietnam`);
});
