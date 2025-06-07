import http from 'http';
import url from 'url';

import fs from 'fs/promises';
import path from 'path';

import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const historyFilePath = path.join(__dirname, 'api_history.json');


let sumAPICallCount = 0;
let apiCallHistory = [];

async function saveHistory() {
    try {
        // Ghi toàn bộ mảng apiCallHistory vào file, format JSON cho đẹp
        await fs.writeFile(historyFilePath, JSON.stringify(apiCallHistory, null, 2));
        console.log('Lịch sử API đã được lưu vào file.');
    } catch (error) {
        console.error('Lỗi khi lưu file lịch sử:', error);
    }
}

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

const requestHandler = async (request, response) => {
    const parsedUrl = url.parse(request.url, true);
    const pathname = parsedUrl.pathname;
    const method = request.method;
    const queryParams = parsedUrl.query;

    console.log(`Nhận yêu cầu: ${method} ${pathname}`);
    response.setHeader('Content-Type', 'application/json; charset=utf-8');

    if ( pathname === '/sum' && method === 'GET'){
        const num1str = queryParams.num1;
        const num2str = queryParams.num2;
        const num1 = parseFloat(num1str);
        const num2 = parseFloat(num2str);

        if (isNaN(num1) || isNaN(num2)){
            response.writeHead(400);
            response.end(JSON.stringify({
                error: " Data not accept. 'num1' and 'num2' need to be a number!!!"
            }));
        } else {
            const sumResult = num1 + num2;
            sumAPICallCount++;

            const historyEntry = {
                endpoint: "/sum",
                input: { num1: num1, num2: num2},
                output: {sum: sumResult},
                timestamp: new Date().toISOString()
            }
            apiCallHistory.push(historyEntry);
            console.log('Đã ghi lịch sử cho /sum. Số mục lịch sử:', apiCallHistory.length);
            await saveHistory();

            response.writeHead(200);
            response.end(JSON.stringify({
                sum: sumResult,
                num1_received: num1,
                num2_received: num2
            }));
        }
    } else if (pathname === '/current-time-vietnam' && method === 'GET'){
        const now = new Date();
        const dateTimeParts = now.toLocaleString('sv-SE', option); 
        const formattedVietnamTime = dateTimeParts.replace(' ', '/') + "+07:00";

        const historyEntry = {
            endpoint: "/current-time-vietnam",
            input: {}, 
            output: { currentTime: formattedVietnamTime },
            timestamp: new Date().toISOString()
        };
        apiCallHistory.push(historyEntry);
        console.log('Đã ghi lịch sử cho /current-time-vietnam. Số mục lịch sử:', apiCallHistory.length);
        await saveHistory();

        response.writeHead(200);
        response.end(JSON.stringify({
            currentTime: formattedVietnamTime
        }));

    } else if (pathname === '/history' && method === 'GET'){
        response.writeHead(200);
        response.end(JSON.stringify({
            history: apiCallHistory
        }));
    } else {
        response.writeHead(404);
        response.end(JSON.stringify({
            error: "Endpoint not found."
        }));
    }

}

const server = http.createServer(requestHandler);
const PORT = 3000;

const startServer = async () => {
    try {
        const data = await fs.readFile(historyFilePath, 'utf8');
        const historyFromFile = JSON.parse(data);
        
        if(Array.isArray(historyFromFile)) {
            apiCallHistory = historyFromFile;
            console.log(`Đã nạp thành công ${apiCallHistory.length} mục từ lịch sử.`);
        } else {
             console.log('File lịch sử có định dạng không hợp lệ, bắt đầu với lịch sử rỗng.');
             apiCallHistory = [];
        }

    } catch (error) {
        if (error.code === 'ENOENT') {
            console.log('File api_history.json không tìm thấy. Bắt đầu với lịch sử rỗng.');
            apiCallHistory = [];
        } else {
            console.error('Lỗi nghiêm trọng khi đọc file lịch sử:', error);
            process.exit(1);
        }
    }

    server.listen(PORT, () => {
        console.log(`Server đang chạy tại http://localhost:${PORT}`);
        console.log('  Endpoints: /sum, /current-time-vietnam, /history');
    });
};

startServer();
