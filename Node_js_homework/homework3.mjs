
import http from 'node:http';
import url from 'node:url'; 

const port = 3002;

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathName = parsedUrl.pathname;
  const method = req.method;

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (method === 'OPTIONS') {
    res.writeHead(204); 
    res.end();
    return;
  }
if (pathName === '/current-time' && method === 'GET') {
    const now = new Date();
    const timeZone = 'Asia/Ho_Chi_Minh';
    const dateFormatter = new Intl.DateTimeFormat('en-CA', { 
        timeZone: timeZone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });

    const timeFormatter = new Intl.DateTimeFormat('en-GB', { 
        timeZone: timeZone,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    });

    const datePart = dateFormatter.format(now); 
    const timePart = timeFormatter.format(now); 

    const vietnamTimeString = `${datePart}T${timePart} +07:00`;
    
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    console.log("Vietnam Time (Intl.DateTimeFormat):", vietnamTimeString);
    res.end(JSON.stringify(vietnamTimeString));

  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('404 Not Found - Endpoint');
  }
});

server.listen(port, () => {
  console.log(`Server Node.js thuần đang chạy tại http://localhost:${port}`);
  console.log(`Để lấy thời gian UTC hiện tại: GET http://localhost:${port}/current-time`);
});