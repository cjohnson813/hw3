const fs = require('fs');
const path = require('path');


function sendFile(res, filePath) {
  const resolved = path.normalize(path.join(process.cwd(), filePath));

  fs.readFile(resolved, (err, data) => {
    // error message 
    if (err) {
      const code = err.code === 'ENOENT' ? 404 : 500;
      res.writeHead(code, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end(code === 404 ? '404 Not Found' : '500 Internal Server Error');\
      return;
    }
    // always initially send as HTML
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(data);
  });
}

module.exports = { sendFile };
