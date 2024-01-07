const { readFile, writeFile, readFileSync } = require('fs');

const getAll = (path, callback) => {
  readFile(path, 'utf8', (err, data) => {
    if (err) {
      throw err;
    }
    
    try {
      callback( JSON.parse(data) );
    } catch {
      callback([]);
    }
  });
}

const write = (path, data) => {
  writeFile(path, JSON.stringify(data), {}, err => {
    if (err) {
      throw err;
    }
  });
}

async function read(path) {
  try {
    return await readFile(path, { encoding: 'utf8' },  () => {} );
  } catch (err) {
    console.log(err);
  }
}

/**
 * Working synchronous file reading.
 * @param path
 * @returns {any}
 */
function readSync(path) {
  try {
    return JSON.parse(readFileSync(path, 'utf8'));
  } catch (err) {
    throw err;
  }
}

module.exports = {write, getAll, read, readSync};