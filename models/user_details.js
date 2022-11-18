const mongoose = require('mongoose')

const User_detailsSchema = new mongoose.Schema({
    userID: {
      type: String,
      required: true
    },
    firstName: {
      type: String,
      required : true
    },
    lastName: {
        type: String,
        required : true
    },
    username: {
        type: String,
        required : true
    },
    password: {
        type: String,
        required : true
    },   
    userTypeID: {
      type: String,
      required: true
    }
}, {collection : 'user_details'})

module.exports = mongoose.model('User_details', User_detailsSchema)