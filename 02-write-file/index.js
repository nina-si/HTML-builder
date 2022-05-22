const fs = require('fs');
const readline = require('readline');
const process = require('process');
const path = require('path');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const filePath = path.join(__dirname, 'text.txt');

fs.writeFile(filePath, '', (error) => {
  if (error) throw error;

  console.log('Hello! Leave a message here: ');

  rl.on('line', (line) => {
    if (line === 'exit') {
      rl.close();
      return;
    }
    fs.appendFile(filePath, `${line}\n`, (error) => {
      if (error) throw error;
      console.log(`Add a new line or type "exit"...`);
    });
  });

  process.on('exit', () => {
    console.log('Thank you, your input has been saved...');
  });
});
