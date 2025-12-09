import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync, existsSync, readdirSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 10000;

const distPath = join(__dirname, 'dist');
const indexPath = join(distPath, 'index.html');

// Check if dist folder exists
if (!existsSync(distPath)) {
  console.error(`ERROR: dist folder not found at ${distPath}`);
  console.error('Make sure "npm run build" completed successfully');
  process.exit(1);
}

// Check if index.html exists
if (!existsSync(indexPath)) {
  console.error(`ERROR: index.html not found at ${indexPath}`);
  console.error('Contents of dist folder:', existsSync(distPath) ? readdirSync(distPath) : 'dist folder does not exist');
  process.exit(1);
}

console.log('✓ dist folder found');
console.log('✓ index.html found');
console.log(`Starting server on port ${PORT}`);

// Serve static files from the dist directory
app.use(express.static(distPath));

// Handle client-side routing - serve index.html for all routes
app.get('*', (req, res) => {
  try {
    const html = readFileSync(indexPath, 'utf-8');
    res.send(html);
  } catch (error) {
    console.error('Error reading index.html:', error);
    res.status(500).send(`Error serving the application: ${error.message}`);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

