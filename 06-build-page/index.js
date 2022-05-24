const path = require('path');
const fs = require('fs');

const destPath = path.join(__dirname, 'project-dist/');
let html = '';

const readStream = fs.createReadStream(
  path.join(__dirname, 'template.html'),
  'utf8'
);

const mergeStyles = (srcPath, bundlePath) => {
  fs.writeFile(bundlePath, '', (err) => {
    if (err) throw err;

    fs.readdir(srcPath, { withFileTypes: true }, (err, files) => {
      if (err) throw err;
      const filesArr = [...files].reverse();
      filesArr.forEach((file) => {
        if (file.isFile() && path.extname(file.name) === '.css') {
          fs.readFile(path.join(srcPath, file.name), 'utf8', (err, data) => {
            if (err) throw err;
            fs.appendFile(bundlePath, `${data}\n`, (err) => {
              if (err) throw err;
            });
          });
        }
      });
    });
  });
};

const copyDir = (srcPath, destPath) => {
  fs.mkdir(destPath, { recursive: true }, (err) => {
    if (err) throw err;
    fs.readdir(srcPath, { withFileTypes: true }, (err, files) => {
      if (err) throw err;
      files.forEach((item) => {
        if (item.isFile()) {
          fs.copyFile(
            path.join(srcPath, item.name),
            path.join(destPath, item.name),
            () => {}
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
};

readStream.on('data', (data) => {
  html = data;

  const components = {};

  fs.readdir(
    path.join(__dirname, 'components/'),
    { withFileTypes: true },
    (err, files) => {
      if (err) throw err;

      files.forEach((item) => {
        const fileName = path.basename(item.name, path.extname(item.name));
        const stream = fs.createReadStream(
          path.join(__dirname, 'components/', item.name),
          'utf8'
        );
        stream.on('data', (data) => {
          components[`{{${fileName}}}`] = data;
          const tags = html.match(/{{.*}}/g);

          fs.rm(destPath, { recursive: true, force: true }, () => {
            for (let i = 0; i < tags.length; i++) {
              html = html.replace(tags[i], components[tags[i]]);
            }
            fs.mkdir(destPath, { recursive: true }, (err) => {
              if (err) throw err;

              copyDir(
                path.join(__dirname, 'assets/'),
                path.join(destPath, 'assets/')
              );
              mergeStyles(
                path.join(__dirname, 'styles/'),
                path.join(destPath, 'style.css')
              );
              fs.writeFile(path.join(destPath, 'index.html'), html, (err) => {
                if (err) throw err;
              });
            });
          });
        });
      });
    }
  );
});
