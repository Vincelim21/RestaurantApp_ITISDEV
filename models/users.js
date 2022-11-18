const mongoose = require('mongoose')

const Users_Schema = new mongoose.Schema({
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
  },{collection : 'users'})

module.exports = mongoose.model('Users', Users_Schema)