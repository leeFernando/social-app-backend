const db = require('../models'),
  jwt = require('jsonwebtoken');

exports.signin = async function(req, res, next) {
  try {
    // find the user with given email
    let user = await db.User.findOne({ email: req.body.email });
    // check if the password given match the user password in DB
    let { id, username, profileImageUrl } = user;
    let isMatch = await user.comparePassword(req.body.password);
    // if match, log the user in
    if (isMatch) {
      let token = jwt.sign(
        {
          id,
          username,
          profileImageUrl,
        },
        process.env.SECRET_KEY,
      );
      return res.status(200).json({
        id,
        username,
        profileImageUrl,
        token,
      });
    } else {
      return next({
        status: 400,
        message: 'Password is incorrect.',
      });
    }
  } catch (error) {
    return next({
      status: 400,
      message: 'Invalid Email.',
    });
  }
};

exports.signup = async function(req, res, next) {
  try {
    // create a user
    // create a token (signing a token)
    // process.env.SECRET_KEY
    let user = await db.User.create(req.body);
    let { id, username, profileImageUrl } = user;
    let token = jwt.sign(
      // this payload will be encrypted (if decrypted will result in this obj)
      {
        id,
        username,
        profileImageUrl,
      },
      process.env.SECRET_KEY,
    );
    return res.status(200).json({
      id,
      username,
      profileImageUrl,
      token,
    });
  } catch (err) {
    // see what kind of err
    // if it is a certain err
    // respond with username/email already taken
    // otherwise just send back a generic 400
    // if a validation fails:
    if (err.code === 11000) {
      err.message = 'Sorry, username/email is taken';
    }
    return next({
      status: 400,
      message: err.message,
    });
  }
};
