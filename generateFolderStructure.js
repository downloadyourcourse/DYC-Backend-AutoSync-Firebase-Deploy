
const fs = require('fs');
const path = require('path');

function getStructure(dir, baseDir) {
  let structure = '';
  const items = fs.readdirSync(dir, { withFileTypes: true });

  items.forEach(item => {
    const fullPath = path.join(dir, item.name);
    const relativePath = path.relative(baseDir, fullPath).replace(/\\/g, '/');

    structure += relativePath + '\n';

    if (item.isDirectory()) {
      structure += getStructure(fullPath, baseDir);
    }
  });

  return structure;
}

const baseDir = process.argv[2] || '.'; // Use the provided directory or current directory
const structure = getStructure(baseDir, baseDir);

// Write the structure to 'structure.txt'
fs.writeFileSync('structure.txt', structure, 'utf8');
console.log("Directory structure has been written to 'structure.txt'.");
