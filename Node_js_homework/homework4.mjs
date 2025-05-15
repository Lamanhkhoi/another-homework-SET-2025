
import http from 'node:http';
import url from 'node:url'; 

const port = 3000; 

const apiCallHistory = [];

function logApiCall(endpoint, input, output) {
  const callDetails = {
    endpoint,
    input,
    output,
    timestamp: new Date().toISOString().split('.')[0] + 'Z' 
  };
  apiCallHistory.push(callDetails);
  if (apiCallHistory.length > 50) {
    apiCallHistory.shift(); 
  }
}

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathName = parsedUrl.pathname;
  const method = req.method;

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (method === 'OPTIONS') {
    res.writeHead(204); // No Content
    res.end();
    return;
  }

  let requestInput = {}; 

  if (method === 'POST') {
    try {
      requestInput = await new Promise((resolve, reject) => {
        let bodyChunks = [];
        req.on('data', chunk => {
          bodyChunks.push(chunk);
        });
        req.on('end', () => {
          try {
            const body = Buffer.concat(bodyChunks).toString();
            if (body) {
              resolve(JSON.parse(body));
            } else {
              resolve({}); 
            }
          } catch (e) {
            const errorOutput = { error: 'Invalid JSON body' };
            logApiCall(pathName, body, errorOutput); // Ghi lại input thô nếu parse lỗi
            res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify(errorOutput));
            reject(new Error('Handled Invalid JSON')); // Đánh dấu là đã xử lý để không chạy code phía dưới
          }
        });
        req.on('error', err => {
          reject(err); 
        });
      });
    } catch (error) {
      if (error.message !== 'Handled Invalid JSON') {
        console.error('Error reading POST body:', error);
        const errorOutput = { error: 'Error processing request body' };
        res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify(errorOutput));
      }
      return;
    }
  } else if (method === 'GET') {
    requestInput = parsedUrl.query; 
  }


  // --- Định tuyến và xử lý API ---

  if (pathName === '/sum' && method === 'POST') {
    const { num1, num2 } = requestInput;
    let output;
    let statusCode = 200;

    if (typeof num1 === 'number' && typeof num2 === 'number') {
      output = { sum: num1 + num2 };
    } else {
      statusCode = 400;
      output = { error: 'Invalid input. Expecting num1 and num2 to be numbers.' };
    }
    logApiCall(pathName, requestInput, output);
    res.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify(output));

  } else if (pathName === '/current-time' && method === 'GET') {
    const inputForLog = {}; 
    const now = new Date();
    const utcTimeString = now.toISOString().split('.')[0] + 'Z';
    const output = { currentTime: utcTimeString };

    logApiCall(pathName, inputForLog, output);
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify(output));

  } else if (pathName === '/history' && method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ history: apiCallHistory }));

  } else {
    const output = { error: '404 Not Found - Endpoint không tồn tại' };
    res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify(output));
  }
});

server.listen(port, () => {
  console.log(`Server Node.js thuần đang chạy tại http://localhost:${port}`);
  console.log('API tính tổng (POST): POST http://localhost:3000/sum (body: {"num1": X, "num2": Y})');
  console.log('API thời gian UTC (GET): GET http://localhost:3000/current-time');
  console.log('API lịch sử (GET): GET http://localhost:3000/history');
});