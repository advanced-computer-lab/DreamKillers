const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const jwt = require('jsonwebtoken');
const config = require('config');

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  role:{
    type:String,
    enum:['USER','ADMIN'],
    required:true,
  },
  email: {
    type: String,
    required: true
  },
  password: {
      type:String,
      required:true,
  },
  passportNumber:{
    type:String,
    required:true,
  },
  age: {
    type: Number,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true
  },
  authTokens: {
      type:[String],
  }
}, { timestamps: true });

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, config.get('userAuthSecretKey'), {
    expiresIn: '1h',
  });
  return token;
};

const User = mongoose.model('User', userSchema);

module.exports = User;