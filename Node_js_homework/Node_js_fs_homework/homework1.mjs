// sum-api.mjs
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Helper to get __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_FILE = path.join(__dirname, 'operations_log.json');

// Function to read data from the file
const loadData = () => {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const fileData = fs.readFileSync(DATA_FILE, 'utf8');
      return JSON.parse(fileData);
    }
  } catch (err) {
    console.error('Error reading data file:', err);
  }
  return []; // Return an empty array if file doesn't exist or error occurs
};

// Function to write data to the file
const saveData = (data) => {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('Error writing data file:', err);
  }
};

// Load existing data when the server starts
let operationsLog = loadData();

const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/sum') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        const num1 = data.num1;
        const num2 = data.num2;

        if (typeof num1 === 'number' && typeof num2 === 'number') {
          const sum = num1 + num2;
          const logEntry = {
            num1,
            num2,
            sum
          };

          // Add to our in-memory log and save to file
          operationsLog.push(logEntry);
          saveData(operationsLog);

          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ sum: sum, message: 'Data saved.' }));
        } else {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Invalid input. Both num1 and num2 must be numbers.' }));
        }
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON input.' }));
      }
    });
  } else if (req.method === 'GET' && req.url === '/logs') { // Optional: Endpoint to view logs
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(operationsLog));
  }
  else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not found' }));
  }
});

server.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
  console.log(`Data will be persisted to: ${DATA_FILE}`);
  if (operationsLog.length > 0) {
    console.log(`Loaded ${operationsLog.length} previous operation(s) from log.`);
  }
});