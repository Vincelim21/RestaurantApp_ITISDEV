const mongoose = require('mongoose')

const User_typeSchema = new mongoose.Schema({
    userTypeID: {
      type: String,
      required: true
    },
    userTypeName: {
      type: String,
      required : true
    }
}, {collection : 'user_type'})

module.exports = mongoose.model('User_type', User_typeSchema)