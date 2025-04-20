const fs = require('fs');
const path = require('path');

// Read the targets JSON file
const targetsPath = path.join(__dirname, '../public/data/targets_1.json');
const targetsData = JSON.parse(fs.readFileSync(targetsPath, 'utf8'));

// Function to check if an image exists
function checkImageExists(id) {
    const paddedId = id.padStart(12, '0'); // Pad to 12 digits total
    const imagePath = path.join(__dirname, '../public/data/image', `${paddedId}.jpg`);
    return fs.existsSync(imagePath);
}

// Find missing images
const missingImages = Object.keys(targetsData).filter(id => !checkImageExists(id));

console.log('Missing images for the following target IDs:');
missingImages.sort((a, b) => Number(a) - Number(b)); // Sort numerically
console.log(missingImages.join(', '));
console.log(`\nTotal missing images: ${missingImages.length}`); 