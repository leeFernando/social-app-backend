const express = require('express'),
  router = express.Router({ mergeParams: true }), // to be able to access the url params from the prefix
  { createTweet, getTweet, deleteTweet } = require('../handlers/tweets');

// prefix - /api/users/:id/tweets
router.route('/').post(createTweet);

// prefix - /api/users/:id/tweets/:tweet_id
router
  .route('/:tweet_id')
  .get(getTweet)
  .delete(deleteTweet);

module.exports = router;
