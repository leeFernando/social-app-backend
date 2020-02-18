const jwt = require('jsonwebtoken');

// make sure user is logged in - Authentication
exports.loginRequired = function(req, res, next) {
  try {
    const token = req.headers.authorization.split(' ')[1]; //format: Bearer <token>
    jwt.verify(token, process.env.SECRET_KEY, function(err, decoded) {
      if (decoded) return next();
      else
        return next({
          status: 401,
          message: 'You need to log in first.',
        });
    });
  } catch (error) {
    return next({
      status: 401,
      message: 'You need to log in first.',
    });
  }
};

// make sure we get the correct user - Authorization
exports.ensureCorrectUser = function(req, res, next) {
  try {
    const token = req.headers.authorization.split(' ')[1]; //format: Bearer <token>
    jwt.verify(token, process.env.SECRET_KEY, function(err, decoded) {
      if (decoded && decoded.id === req.params.id) return next();
      else
        return next({
          status: 401,
          message: 'Unauthorized',
        });
    });
  } catch (error) {
    return next({
      status: 401,
      message: 'Unauthorized',
    });
  }
};

// For testing authorization:
// put (with quotes) "Authorization: Bearer <other user token>"
