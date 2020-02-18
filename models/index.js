const mongoose = require('mongoose');

mongoose.set('debug', true);
mongoose.Promise = Promise;
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/twitter-clone', {
  keepAlive: true,
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

module.exports.User = require('./user');
module.exports.Tweet = require('./tweet');
