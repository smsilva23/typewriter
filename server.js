import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join, resolve } from 'path';
import { readFileSync, existsSync, readdirSync } from 'fs';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 10000;

// Find dist folder - Vite builds to project root
// Render runs from src/, so we need to go up one level if we're in src
let projectRoot = process.cwd();
if (projectRoot.endsWith('/src') || projectRoot.endsWith('\\src')) {
  projectRoot = resolve(projectRoot, '..');
}

// Try multiple possible locations for dist
let distPath = resolve(projectRoot, 'dist');
if (!existsSync(distPath)) {
  // Try parent directory (in case we're nested deeper)
  const parentDist = resolve(projectRoot, '..', 'dist');
  if (existsSync(parentDist)) {
    distPath = parentDist;
    projectRoot = resolve(projectRoot, '..');
  }
}

const indexPath = join(distPath, 'index.html');

// Check if dist folder exists - if not, try to build it
if (!existsSync(distPath)) {
  console.warn(`WARNING: dist folder not found at ${distPath}`);
  console.warn(`Project root: ${projectRoot}`);
  console.warn(`__dirname: ${__dirname}`);
  console.warn('Attempting to build...');
  
  // Try to build
  try {
    process.chdir(projectRoot);
    execSync('npm run build', { stdio: 'inherit', cwd: projectRoot });
    
    // Check again
    if (!existsSync(distPath)) {
      console.error('Build completed but dist folder still not found');
      console.error('Contents of project root:', existsSync(projectRoot) ? readdirSync(projectRoot) : 'project root does not exist');
      process.exit(1);
    }
    console.log('✓ Build completed successfully');
  } catch (error) {
    console.error('Build failed:', error.message);
    console.error('Contents of project root:', existsSync(projectRoot) ? readdirSync(projectRoot) : 'project root does not exist');
    process.exit(1);
  }
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

