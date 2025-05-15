import http from 'node:http';
import url from 'node:url';

let sumApiCallCount = 0;

const port = 3001;

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true); 
  const pathName = parsedUrl.pathname;
  const method = req.method;

  res.setHeader('Access-Control-Allow-Origin', '*'); 
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (method === 'OPTIONS') {
    res.writeHead(204); 
    res.end();
    return;
  }
  if (pathName === '/sum-endpoint' && method === 'GET') {
    sumApiCallCount++;
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end(`API count: ${sumApiCallCount}`);
  } else if (pathName === '/calculate-sum-post' && method === 'GET') {
    sumApiCallCount++;
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    const responseBody = { message: 
        'Sum calculation (POST) successful',
        currentCallCount: sumApiCallCount};
    res.end(JSON.stringify(responseBody));
    } else {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('404 Not Found');
  }
});

server.listen(port, () => {
  console.log(`Server Node.js thuần đang chạy tại http://localhost:${port}`);
  console.log('Call API sum count (GET): GET http://localhost:3001/sum-endpoint');
  console.log('call API sum count (GET): GET http://localhost:3001/calculate-sum-post');
});