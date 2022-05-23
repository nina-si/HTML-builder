const path = require('path');
const fs = require('fs');

const srcPath = path.join(__dirname, 'files/');
const destPath = path.join(__dirname, 'files-copy/');

const copyDir = () => {
  fs.rm(destPath, { recursive: true, force: true }, () => {
    fs.mkdir(path.join(__dirname, 'files-copy'), { recursive: true }, (err) => {
      if (err) throw err;

      fs.readdir(srcPath, { withFileTypes: true }, (err, files) => {
        if (err) throw err;
        files.forEach((file) => {
          fs.copyFile(
            path.join(srcPath, file.name),
            path.join(destPath, file.name),
            () => {
              console.log(`File ${file.name} is copied`);
            }
          );
        });
      });
    });
  });
};

copyDir();
