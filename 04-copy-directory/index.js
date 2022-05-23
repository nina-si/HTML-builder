const path = require('path');
const fs = require('fs');

const copyDir = (srcPath, destPath) => {
  fs.rm(destPath, { recursive: true, force: true }, () => {
    fs.mkdir(destPath, { recursive: true }, (err) => {
      if (err) throw err;

      fs.readdir(srcPath, { withFileTypes: true }, (err, files) => {
        if (err) throw err;
        files.forEach((item) => {
          if (item.isFile()) {
            fs.copyFile(
              path.join(srcPath, item.name),
              path.join(destPath, item.name),
              () => {
                console.log(`File ${item.name} is copied`);
              }
            );
          } else if (item.isDirectory()) {
            copyDir(
              path.join(srcPath, item.name),
              path.join(destPath, item.name)
            );
          }
        });
      });
    });
  });
};

const srcPath = path.join(__dirname, 'files/');
const destPath = path.join(__dirname, 'files-copy/');

copyDir(srcPath, destPath);

module.exports = copyDir;
