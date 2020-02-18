const mongoose = require('mongoose'),
  User = require('./user'); // import to use User.findById

const tweetSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
      maxLength: 160,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  },
);

tweetSchema.pre('remove', async function(next) {
  try {
    // find a user
    let user = await User.findById(this.user);
    // remove the tweet id from user tweet list
    user.tweets.remove(this.id);
    // save that user
    await user.save();
    // return next
    return next();
  } catch (err) {
    return next(err);
  }
});

const Tweet = mongoose.model('Tweet', tweetSchema);
module.exports = Tweet;
