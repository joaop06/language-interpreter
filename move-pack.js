const fs = require('fs');
const path = require('path');

// Get the package name and version from package.json
const { name, version } = require('./package.json');

const packFileName = `${name}-${version}.tgz`;
const sourcePath = path.join(__dirname, packFileName);

const destinationFolder = path.join(__dirname, 'versions');
const destinationPath = path.join(destinationFolder, packFileName);

// Garantir que a pasta de destino existe
if (!fs.existsSync(destinationFolder)) {
    fs.mkdirSync(destinationFolder, { recursive: true });
}

// Move the file
fs.rename(sourcePath, destinationPath, (err) => {
    if (err) {
        console.error('Error when move the package:', err);
    } else {
        console.log(`Package moved for: ${destinationPath}`);
    }
});
