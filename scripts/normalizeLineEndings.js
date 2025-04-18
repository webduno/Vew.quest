const fs = require('fs');
const path = require('path');

// Read the annotations file
const annotationsPath = path.join(__dirname, '../public/data/annotations.json');
const normalizedPath = annotationsPath.replace('.json', '_normalized.json');
const data = fs.readFileSync(annotationsPath, 'utf8');

// Parse the JSON
let annotations = JSON.parse(data);

// Function to check if a string ends with a period and newline
const hasProperEnding = (str) => {
    return str.endsWith('.\n') || str.endsWith('."');
};

// Process each annotation
let modified = false;
const normalizedAnnotations = { ...annotations };

for (const [key, value] of Object.entries(normalizedAnnotations)) {
    if (!hasProperEnding(value)) {
        // If it ends with a period but no newline, add newline
        if (value.endsWith('.')) {
            normalizedAnnotations[key] = value + '\n';
            modified = true;
            console.log(`Added newline to: ${key}`);
        }
        // If it ends with ." (quote after period), add newline
        else if (value.endsWith('."')) {
            normalizedAnnotations[key] = value + '\n';
            modified = true;
            console.log(`Added newline to: ${key}`);
        }
        // If it doesn't end with a period, add one and a newline
        else {
            normalizedAnnotations[key] = value + '.\n';
            modified = true;
            console.log(`Added period and newline to: ${key}`);
        }
    }
}

if (modified) {
    // Write to a new file with _normalized suffix
    fs.writeFileSync(
        normalizedPath,
        JSON.stringify(normalizedAnnotations, null, 2),
        'utf8'
    );
    console.log(`Original file preserved at: ${annotationsPath}`);
    console.log(`Normalized version saved to: ${normalizedPath}`);
} else {
    console.log('No modifications were necessary.');
} 