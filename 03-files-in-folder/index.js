const path = require('path');
const fs = require('fs');

const folderPath = path.join(__dirname, 'secret-folder/');

fs.readdir(folderPath, { withFileTypes: true }, (err, files) => {
  if (err) throw err;
  files.forEach((item) => {
    if (item.isFile()) {
      const ext = path.extname(item.name);
      const fileName = path.basename(item.name, ext);
      const filePath = path.join(folderPath, item.name);
      fs.stat(filePath, (err, stats) => {
        if (err) throw err;
        const size = stats.size;
        console.log(`${fileName} - ${ext.slice(1)} - ${size}B`);
      });
    }
  });
});
