const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

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
    email: {
        type: String,
        required : true
    },
    password: {
        type: String,
        required : true
    },   
    userTypeName: {
      type: String,
      required : true
    }
}, {collection : 'user_details'})

// still figuring out how to call this one to encrypt
User_detailsSchema.pre('save', async function (next) {
  try{
    // console.log("Called before saving a user")
    const salt = await bcrypt.genSalt(10)
    console.log(this.email, this.password)
    const hashedPassword = await bcrypt.hash(this.password, salt)
    this.password = hashedPassword
    next()
  }catch (error) {
    next (error)
  }
})


// User_detailsSchema.post('save', async function (next) {
//   try{
//     console.log("Called after saving a user")
//   }catch (error) {
//     next (error)
//   }
// })

module.exports = mongoose.model('User_details', User_detailsSchema)