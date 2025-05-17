import http from 'node:http';
import url from 'node:url';

const port = 3000;

const apiCallHistory = [];

function logApiCall(endpoint, input, output, statusCode) {
  const now = new Date();
  
  const timeZone = 'Asia/Ho_Chi_Minh';

  // Formatter for day (YYYY-MM-DD)
  const dateFormatter = new Intl.DateTimeFormat('en-CA', { 
    timeZone: timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });

  // Formatter for hour (HH:mm:ss)
  const timeFormatter = new Intl.DateTimeFormat('en-GB', { 
    timeZone: timeZone,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false 
  });

  //Format date and hours
  const datePart = dateFormatter.format(now); 
  const timePart = timeFormatter.format(now); 
  const formattedTimestamp = `${datePart}T ${timePart}+07:00`;
  const callDetails = {
    endpoint,
    input,
    output,
    statusCode,
    timestamp: formattedTimestamp 
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

  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  let requestInput = {};
  let rawRequestBody = ''; 

  if (method === 'POST') {
    try {
      rawRequestBody = await new Promise((resolve, reject) => {
        let bodyChunks = [];
        req.on('data', chunk => {
          bodyChunks.push(chunk);
        });
        req.on('end', () => {
          const body = Buffer.concat(bodyChunks).toString();
          resolve(body); // Resolve với body thô
        });
        req.on('error', err => {
          reject(err);
        });
      });

      if (rawRequestBody) {
        requestInput = JSON.parse(rawRequestBody); // Parse JSON
      } else {
        requestInput = {};
      }

    } catch (e) { // check bugs JSON.parse
      const errorOutput = { error: 'Invalid JSON body' };
      logApiCall(pathName, { rawBody: rawRequestBody }, errorOutput, 400);
      res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify(errorOutput));
      return;
    }
  } else if (method === 'GET') {
    requestInput = parsedUrl.query;
  }

  // --- Routing ---
  if (pathName === '/sum' && method === 'POST') { 
    let output;
    let statusCode = 200;

    const { num1, num2 } = requestInput;

    if (typeof num1 === 'number' && typeof num2 === 'number') {
      output = { sum: num1 + num2 };
    } else {
      statusCode = 400;
      output = { error: 'Invalid input. Expecting num1 and num2 to be numbers in JSON body.' };
    }

    logApiCall(pathName, requestInput, output, statusCode);
    res.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify(output));

  } else if (pathName === '/current-time' && method === 'GET') {
    let output;
    let statusCode = 200;
    const now = new Date(); 
    const timeZone = 'Asia/Ho_Chi_Minh';
    const dateFormatter = new Intl.DateTimeFormat('en-CA', { // YYYY-MM-DD
        timeZone: timeZone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });

    const timeFormatter = new Intl.DateTimeFormat('en-GB', { // HH:mm:ss
        timeZone: timeZone,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    });

    try {
        const datePart = dateFormatter.format(now);
        const timePart = timeFormatter.format(now);
        output = { currentTime: `${datePart}T ${timePart}+07:00` };
    } catch (e) {
        console.error("Error formatting date:", e);
        statusCode = 500;
        output = { error: "Error formatting server time" };
    }

    logApiCall(pathName, requestInput, output, statusCode);
    res.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify(output));

  } else if (pathName === '/history' && method === 'GET') {
    const outputForClient = { history: apiCallHistory };
    logApiCall(pathName, requestInput, { message: "Successfully retrieved history" }, 200);
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify(outputForClient));

  } else {
    const output = { error: '404 Not Found - Endpoint or Method not supported' };
    logApiCall(pathName, requestInput, output, 404);
    res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify(output));
  }
});

server.listen(port, () => {
  console.log(`Server Node.js is running at http://localhost:${port}`);
  console.log('API Sum (POST): POST http://localhost:3000/sum (body: {"num1": X, "num2": Y})');
  console.log('API Time (GET): GET http://localhost:3000/current-time');
  console.log('API History (GET): GET http://localhost:3000/history');
});