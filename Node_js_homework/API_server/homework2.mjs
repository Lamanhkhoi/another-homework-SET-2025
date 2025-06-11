import http from 'http';
import url from 'url';

let sumAPICallCount = 0;

const requestHandler = (requestFromClient, responseToClient) => {
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
            console.log(`API /sum is success. sum call-count: ${sumAPICallCount}`);
            const sumResult = num1 + num2;
            responseToClient.writeHead(200); 
            responseToClient.end(JSON.stringify({
                sum: sumResult,
                num1_received: num1,
                num2_received: num2
            }));
            sumAPICallCount++;
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

server.listen(PORT, () => {
    console.log(`Server đang chạy tại http://localhost:${PORT}`);
    console.log('API sum: /sum?num1=X&num2=Y');
    console.log('API count api /sum had succeed: /sum/call-count (GET)');
});