const path = require('path');
const fs = require('fs');

const srcPath = path.join(__dirname, 'styles/');
const bundlePath = path.join(__dirname, 'project-dist/', 'bundle.css');

fs.writeFile(bundlePath, '', (err) => {
  if (err) throw err;

  fs.readdir(srcPath, { withFileTypes: true }, (err, files) => {
    if (err) throw err;
    files.forEach((file) => {
      if (file.isFile() && path.extname(file.name) === '.css') {
        fs.readFile(path.join(srcPath, file.name), 'utf8', (err, data) => {
          if (err) throw err;
          fs.appendFile(bundlePath, `${data}\n`, (err) => {
            if (err) throw err;
            console.log(`Copied styles from ${file.name} into bundle.css`);
          });
        });
      }
    });
  });
});
