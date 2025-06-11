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
        console.log(`ParseFloat: num1 = ${num1} (kiểu: ${typeof num1}), num2 = ${num2} (kiểu: ${typeof num2})`);

        
        if (isNaN(num1) || isNaN(num2)) {
            responseToClient.writeHead(400);
            responseToClient.end(JSON.stringify({
                error: "Invalid input data. 'num1' and 'num2' must be valid numbers."
            }));
        } else {
            console.log(`API /sum Access`);
            const sumResult = num1 + num2;
            const historyLine = `Timestamp: ${new Date().toISOString()}, Calculation: ${num1} + ${num2} = ${sumResult}\n`;
        
            try {
                await fs.appendFile(historyFilePath, historyLine);
                console.log('Calculation history written to file.');
                await fs.writeFile(countFilePath, sumAPICallCount.toString());
                console.log('updated count file.');
            } catch (error) {
                console.error('Error file history:', error);
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
            error: "Endpoint not found. Let try /sum?num1=X&num2=Y"
        }));
    }
};

const server = http.createServer(requestHandler);
const PORT = 3000; 

const startServer = async () => {
    try {
        const data = await fs.readFile(countFilePath, 'utf8');
        sumAPICallCount = parseInt(data, 10) || 0; 
        console.log(`Had input data to file count: ${sumAPICallCount}`);
    } catch (error) {
        if (error.code === 'ENOENT') {
            console.log('File call-count not found. Let start at count 0.');
            sumAPICallCount = 0;
        } else {
            console.error('Error file call-count:', error);
            process.exit(1);
        }
    }

    server.listen(PORT, () => {
        console.log(`Server is running at http://localhost:${PORT}`);
        console.log('  API sum: /sum?num1=X&num2=Y');
        console.log('  API call-count access: /sum/call-count (GET)');
    });
};

startServer();