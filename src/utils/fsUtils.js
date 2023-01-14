const fs = require('fs').promises;
const path = require('path');

const TALKER_DATA_PATH = '../../src/talker.json';

const readTalker = async () => {
  try {
    const data = await fs.readFile(path.resolve(__dirname, TALKER_DATA_PATH));
    const dataParse = JSON.parse(data);
    return dataParse;
  } catch (error) {
    console.error(`Erro na leitura do arquivo: ${error}`);
  }
};
readTalker();

const writeTalker = async (newTalker) => {
  try {
    const data = await readTalker();
    const newData = JSON.stringify([...data, newTalker]);

    await fs.writeFile(path.resolve(__dirname, TALKER_DATA_PATH), newData);
  } catch (error) {
    console.error(`Erro na escrita do arquivo ${error}`);
  }
};

module.exports = {
  readTalker,
  writeTalker,
};