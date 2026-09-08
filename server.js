const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

const dev = false; // Always false for production hosting
const app = next({ dev });
const handle = app.getRequestHandler();

// Namecheap will automatically assign an available port here
const port = process.env.PORT || 3000; 

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  }).listen(port, (err) => {
    if (err) throw err;
    console.log(`> Server running on port ${port}`);
  });
});
