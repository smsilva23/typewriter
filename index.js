// Entry point for Render - re-exports server.js
// This allows Render to use either "node index.js" or "npm start"
import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 10000;

// Serve static files from the dist directory
app.use(express.static(join(__dirname, 'dist')));

// Handle client-side routing - serve index.html for all routes
app.get('*', (req, res) => {
  try {
    const htmlPath = join(__dirname, 'dist', 'index.html');
    const html = readFileSync(htmlPath, 'utf-8');
    res.send(html);
  } catch (error) {
    res.status(500).send('Error serving the application');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

