const express = require('express');

const app = express();
app.use(express.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';

const { readTalker } = require('./utils/fsUtils');

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.get('/talker', async (req, res) => {
  res.status(HTTP_OK_STATUS).send(await readTalker());
});

app.listen(PORT, () => {
  console.log('Online');
});
