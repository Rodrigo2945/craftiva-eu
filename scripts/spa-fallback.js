import fs from 'node:fs';

const indexPath = 'dist/index.html';
const fallbackPath = 'dist/404.html';

if (!fs.existsSync(indexPath)) {
  console.error('dist/index.html is missing. Run vite build first.');
  process.exit(1);
}

fs.copyFileSync(indexPath, fallbackPath);
console.log('Copied dist/index.html to dist/404.html for GitHub Pages.');
