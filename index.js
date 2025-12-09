// Entry point for Render - re-exports server.js
// This allows Render to use either "node index.js" or "npm start"
import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join, resolve } from 'path';
import { readFileSync, existsSync, readdirSync } from 'fs';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 10000;

// Find project root by looking for package.json
// Render might have files in different locations
let projectRoot = process.cwd();
let distPath;

// Try to find package.json to determine project root
const possibleRoots = [
  projectRoot,
  resolve(projectRoot, '..'),
  resolve(projectRoot, '../..'),
  join(projectRoot, 'src'),
  resolve(projectRoot, '..', 'src')
];

let foundRoot = null;
for (const root of possibleRoots) {
  if (existsSync(join(root, 'package.json'))) {
    foundRoot = root;
    break;
  }
}

if (foundRoot) {
  projectRoot = foundRoot;
  distPath = resolve(projectRoot, 'dist');
} else {
  // Fallback: use current directory structure
  if (projectRoot.endsWith('/src') || projectRoot.endsWith('\\src')) {
    projectRoot = resolve(projectRoot, '..');
  }
  distPath = resolve(projectRoot, 'dist');
}

const packageJsonPath = join(projectRoot, 'package.json');

const indexPath = join(distPath, 'index.html');

// Check if dist folder exists - if not, try to build it
if (!existsSync(distPath)) {
  console.warn(`WARNING: dist folder not found at ${distPath}`);
  console.warn(`Project root: ${projectRoot}`);
  console.warn(`__dirname: ${__dirname}`);
  console.warn(`Current working directory: ${process.cwd()}`);
  
  // Verify package.json exists before building
  if (!existsSync(packageJsonPath)) {
    console.error(`ERROR: package.json not found at ${packageJsonPath}`);
    console.error('Searched in:', possibleRoots);
    console.error('Contents of current dir:', existsSync(process.cwd()) ? readdirSync(process.cwd()) : 'does not exist');
    if (existsSync(projectRoot)) {
      console.error('Contents of project root:', readdirSync(projectRoot));
    }
    process.exit(1);
  }
  
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

