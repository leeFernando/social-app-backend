const db = require('../models');

// prefix: '/api/users/:id/tweets', route: '/'
exports.createTweet = async function(req, res, next) {
  try {
    // create new tweet
    let tweet = await db.Tweet.create({
      text: req.body.text,
      user: req.params.id, // possible due to {mergeParams: true}
    });
    // find the current user and push the new tweet
    let foundUser = await db.User.findById(req.params.id);
    foundUser.tweets.push(tweet.id);
    await foundUser.save();
    // return the new tweet but with additional info (username and profileImageUrl)
    let foundTweet = await db.Tweet.findById(tweet.id).populate('user', {
      username: true,
      profileImageUrl: true,
    });
    return res.status(200).json(foundTweet);
  } catch (error) {
    return next(err);
  }
};

// GET - /api/users/:id/tweets/:tweet_id
exports.getTweet = async function(req, res, next) {
  try {
    let tweet = await db.Tweet.findById(req.params.tweet_id);
    return res.status(200).json(tweet);
  } catch (error) {
    return next(err);
  }
};

// DELETE - /api/users/:id/tweets/:tweet_id
exports.deleteTweet = async function(req, res, next) {
  try {
    let foundTweet = await db.Tweet.findById(req.params.tweet_id);
    await foundTweet.remove(); //findByIdAndRemove is not compatible with pre remove inside the tweet model
    return res.status(200).json(foundTweet);
  } catch (error) {
    return next(err);
  }
};

module.exports = exports;
