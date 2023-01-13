const express = require('express');

const app = express();
app.use(express.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';

const { readTalker } = require('./utils/fsUtils');
const { generateToken } = require('./utils/generateToken');
const validateEmail = require('./middlewares/validateEmail');
const validatePassword = require('./middlewares/validatePassword');

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.get('/talker', async (req, res) => {
  res.status(HTTP_OK_STATUS).send(await readTalker());
});

app.get('/talker/:id', async (req, res) => {
  const talker = await readTalker();
  const talkerId = talker.find(({ id }) => id === Number(req.params.id));

  if (!talkerId) {
    res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
  }
  res.status(200).json(talkerId);
});

app.post('/login', validateEmail, validatePassword, (req, res) => {
  const { email, password } = req.body;
  const token = generateToken();

  if (email && password) {
    return res.status(200).json({ token: `${token}` });
  }
});

app.listen(PORT, () => {
  console.log('Online');
});
