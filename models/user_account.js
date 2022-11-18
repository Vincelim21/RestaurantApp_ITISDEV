const mongoose = require('mongoose')

const Users_accountSchema = new mongoose.Schema({
  userID: {
    type: Number,
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

module.exports = mongoose.model('Users_account', Users_accountSchema)