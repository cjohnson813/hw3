const fs = require('fs');
const path = require('path');

// return content type based on file extension
function getContentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();

  // file type mapping
  const map = {
    '.html': 'text/html; charset=utf-8',
    '.css':  'text/css; charset=utf-8',
    '.js':   'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.txt':  'text/plain; charset=utf-8',
    '.jpg':  'image/jpeg',
    '.png':  'image/png',
    '.pdf':  'application/pdf'
  };

  return map[ext] || 'application/octet-stream';
}

// function to send a response which will eventually indicate specified content type
function sendResponse(res, status, headers, body) {
  res.writeHead(status, headers);
  res.end(body);
}


function sendFile(res, filePath) {
  // change 'resolved' path to 'absolute' path
  const absolute = path.normalize(path.join(process.cwd(), filePath));

  fs.readFile(resolved, (err, data) => {
    // error message if file type is not found/accepted
    if (err) {
      const code = err.code === 'ENOENT' ? 404;
      const msg = code === 404 ? '404 Not Found';
      return sendResponse(res, code, { 'Content-Type': 'text/plain; charset=utf-8' }, msg);;
    }
    // execute function to determine file type and send response if accepted
    const contentType = getContentType(absolute);
    return sendResponse(res, 200, { 'Content-Type': contentType }, data);
  });
}
// added 'getContentType' and 'sendResponse'
module.exports = { sendFile, getContentType, sendResponse };
