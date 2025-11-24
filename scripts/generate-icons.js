// Icon generation script
// Run with: node scripts/generate-icons.js
// Requires: npm install sharp (for PNG generation)

const fs = require('fs');
const path = require('path');

const iconSvg = `<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" fill="#4f46e5" rx="64"/>
  <path d="M128 160 L192 224 L352 96" stroke="white" stroke-width="48" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <rect x="128" y="280" width="256" height="48" rx="8" fill="white"/>
  <rect x="128" y="360" width="192" height="48" rx="8" fill="white"/>
</svg>`;

async function generateIcons() {
  try {
    const sharp = require('sharp');
    const publicDir = path.join(__dirname, '..', 'public');

    // Generate 192x192 icon
    await sharp(Buffer.from(iconSvg))
      .resize(192, 192)
      .png()
      .toFile(path.join(publicDir, 'icon-192.png'));

    // Generate 512x512 icon
    await sharp(Buffer.from(iconSvg))
      .resize(512, 512)
      .png()
      .toFile(path.join(publicDir, 'icon-512.png'));

    // Generate favicon
    await sharp(Buffer.from(iconSvg))
      .resize(32, 32)
      .png()
      .toFile(path.join(publicDir, 'favicon.png'));

    console.log('✅ Icons generated successfully!');
    console.log('  - icon-192.png');
    console.log('  - icon-512.png');
    console.log('  - favicon.png');
  } catch (error) {
    if (error.code === 'MODULE_NOT_FOUND') {
      console.log('⚠️  Sharp not installed. Installing...');
      console.log('Run: npm install sharp --save-dev');
      console.log('\nThen run this script again: node scripts/generate-icons.js');
    } else {
      console.error('Error generating icons:', error);
    }
  }
}

generateIcons();
