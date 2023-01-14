const express = require('express');
const path = require('path');

const app = express();
app.use(express.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';

const { readTalker, writeTalker, updateTalker } = require('./utils/fsUtils');
const { generateToken } = require('./utils/generateToken');
const validateEmail = require('./middlewares/validateEmail');
const validatePassword = require('./middlewares/validatePassword');
const auth = require('./middlewares/auth');
const validateName = require('./middlewares/validateName');
const validateAge = require('./middlewares/validateAge');
const validateTalk = require('./middlewares/validateTalk');
const validateWatchedAt = require('./middlewares/validateWatchedAt');
const validateRate = require('./middlewares/validateRate');

app.get('/talker/search', auth, async (req, res) => {
  const { q } = req.query;
  const talker = await readTalker();

  const filterTalker = talker.filter((t) => t.name.includes(q));

  if (!q || q.length === 0) {
    return res.status(200).json(talker);
  }

  return res.status(200).json(filterTalker);
});

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

app.post('/talker',
  auth,
  validateName,
  validateAge,
  validateTalk,
  validateWatchedAt,
  validateRate,
  async (req, res) => {
    const bodyInfo = req.body;
    const talker = await readTalker();
    const newTalker = { id: talker.length + 1, ...bodyInfo };
    await writeTalker(newTalker);

    res.status(201).json(newTalker);
  });

app.delete('/talker/:id', auth, async (req, res) => {
  const { id } = req.params;
  const talker = await readTalker();
  const filterTalker = talker.filter((t) => Number(t.id) !== Number(id));

  await updateTalker(path.resolve(__dirname, './talker.json'), filterTalker);
  res.status(204).json();
});

app.listen(PORT, () => {
  console.log('Online');
});
