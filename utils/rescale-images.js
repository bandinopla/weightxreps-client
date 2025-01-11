/**
 * Utility script to rescale images...
 * Usage: node resize.js <input-folder> <output-folder> <scale>
 */
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

// Get command-line arguments for input folder, output folder, and scale factor
const inputFolder = process.argv[2]; // Input folder path
const outputFolder = process.argv[3]; // Output folder path
const scale = parseFloat(process.argv[4]); // Scale factor (e.g., 0.3 for 30%)

// Check if all necessary arguments are provided
if (!inputFolder || !outputFolder || isNaN(scale)) {
  console.error("Usage: node resize.js <input-folder> <output-folder> <scale>");
  process.exit(1);
}

// Create output folder if it doesn't exist
fs.mkdirSync(outputFolder, { recursive: true });

fs.readdirSync(inputFolder).forEach((file) => {
  const inputPath = path.join(inputFolder, file);
  const outputPath = path.join(outputFolder, file);

  sharp(inputPath)
    .metadata()
    .then(({ width, height }) => {
      // Scale to specified percentage of original width and height
      return sharp(inputPath)
        .resize(Math.floor(width * scale), Math.floor(height * scale)) // Scaling by the scale factor
        .toFile(outputPath)
        .then(() => console.log(`Resized: ${file}`))
        .catch((err) => console.error(`Error resizing ${file}:`, err));
    })
    .catch((err) => console.error(`Error reading metadata for ${file}:`, err));
});
