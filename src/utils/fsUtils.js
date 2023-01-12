const fs = require('fs').promises;
const path = require('path');

const readTalker = async () => {
  try {
    const data = await fs.readFile(path.resolve(__dirname, '../../src/talker.json'));
    const dataParse = JSON.parse(data);
    return dataParse;
  } catch (error) {
    console.error(`Erro na leitura do arquivo: ${error}`);
  }
};
readTalker();

module.exports = {
  readTalker,
};