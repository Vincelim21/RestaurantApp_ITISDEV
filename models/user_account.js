const mongoose = require('mongoose')

const User_accountSchema = new mongoose.Schema({
  userID: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required : true
  },
  userType: {
    type: String,
    required: true
  }
  },{collection : 'user_account'})

module.exports = mongoose.model('User_account', User_accountSchema)