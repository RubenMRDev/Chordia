const { exec } = require('child_process');
const path = require('path');

const coveragePath = path.join(__dirname, 'coverage', 'frontend', 'index.html');

// Open coverage report in default browser
exec(`start ${coveragePath}`, (error) => {
  if (error) {
    console.error('Error opening coverage report:', error);
    console.log('You can manually open the coverage report at:');
    console.log(coveragePath);
  } else {
    console.log('Coverage report opened in browser!');
  }
}); 