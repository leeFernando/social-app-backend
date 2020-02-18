// to load all env vars:
// - npm install dotenv,
// - create.env file in root of the backend folder
// - then:
require('dotenv').config();

const express = require('express'),
  PORT = 3001,
  app = express(),
  cors = require('cors'),
  db = require('./models'),
  bodyParser = require('body-parser'),
  authRoutes = require('./routes/auth'),
  tweetRoutes = require('./routes/tweets'),
  errorHandler = require('./handlers/error'),
  { loginRequired, ensureCorrectUser } = require('./middleware/auth');

app.use(cors());
app.use(bodyParser.json());

app.use('/api/auth', authRoutes);
app.use('/api/users/:id/tweets', loginRequired, ensureCorrectUser, tweetRoutes);

app.get('/api/tweets', loginRequired, async function(req, res, next) {
  try {
    let tweets = await db.Tweet.find()
      .sort({ createdAt: 'desc' })
      .populate('user', {
        username: true,
        profileImageUrl: true,
      });
    return res.status(200).json(tweets);
  } catch (error) {}
});

app.use(function(req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});
app.use(errorHandler);

app.listen(PORT, function() {
  console.log('Server is running on port', PORT);
});
