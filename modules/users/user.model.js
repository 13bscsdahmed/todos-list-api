const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const winston = require('../../config/winston');
const constants = require('../../config/constants');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, index: { unique: true } },
  password: { type: String, required: true },
  userType: {
    type: String, required: true, enum: Object.values(constants.userTypes), default: constants.userTypes.user,
  },
  isDeleted: { type: Boolean, default: false },
  signUpDate: { type: Number, default: new Date().getTime() },

});

UserSchema.pre('save', function callback(next) {
  const user = this;

  // only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) return next();

  // generate a salt
  return bcrypt.genSalt(10, (err, salt) => {
    if (err) return next(err);

    // hash the password using our new salt
    return bcrypt.hash(user.password, salt, (error, hash) => {
      if (error) return next(error);

      // override the cleartext password with the hashed one
      user.password = hash;
      return next();
    });
  });
});

/**
 * Compares the provided password with the stored hash in the DB
 * @param {String} candidatePassword The provided password of the user which is to be checked.
 * @param {Function} cb The callback function which is to be called after the process.
 */
// eslint-disable-next-line func-names
UserSchema.methods.comparePassword = function (candidatePassword, cb) {
  // intentional use of function keyword to avoid scope error
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    if (err) return cb(err);
    return cb(null, isMatch);
  });
};


const UserObject = mongoose.model('User', UserSchema);

// Creating Admin user if it did not already exist in the DB
UserObject.findOne({ userType: constants.userTypes.admin }).then((userFound) => {
  if (!userFound) {
    if (process.env.ADMIN_PASS) {
      const createUserObject = {
        name: 'Admin',
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASS,
        userType: constants.userTypes.admin,
        gender: constants.genders.male,
        isVerified: true,
      };

      new UserObject(createUserObject).save().then(() => {
        winston.info('Admin account created.');
      }).catch((err) => {
        winston.error(err);
      });
    } else {
      winston.error('No admin password provided.\nStopping server.');
      process.exit(1);
    }
  } else {
    winston.info('Admin account already exists.');
  }
});


module.exports = UserObject;
