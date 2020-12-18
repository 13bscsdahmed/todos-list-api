const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const extractJwt = require('passport-jwt').ExtractJwt;
const mongoose = require('mongoose');
const constants = require('./constants');

const User = mongoose.model('User');

const jwtOptions = {
  jwtFromRequest: extractJwt.fromHeader(constants.tokenHeaderKey),
  secretOrKey: process.env.SESSION_SECRET,
};

passport.use(new JwtStrategy(jwtOptions, (jwtPayload, next) => {
  if (jwtPayload._id) {
    User.findOne({ _id: jwtPayload._id }, (err, user) => {
      if (err) {
        next(err, false);
      } else if (user) {
        next(null, user);
      } else {
        next(null, false, {
          msgCode: '0002',
          status: 401,
        });
      }
    });
  } else {
    next(null, false, {
      msgCode: '0001',
      status: 401,
    });
  }
}));

passport.isAuthenticated = (req, res, next) => {
  passport.authenticate('jwt', (err, user) => {
    if (err) { return next(err); }
    if (!user) {
      return next({
        msgCode: '0003',
        status: 401,
      });
    }
    req.user = user;
    return next();
  })(req, res, next);
};

passport.isAuthorized = userType => (req, res, next) => {
  if (req.user.userType === userType) {
    return next();
  }
  return next({
    msgCode: '0004',
    status: 403,
  });
};

module.exports = passport;
