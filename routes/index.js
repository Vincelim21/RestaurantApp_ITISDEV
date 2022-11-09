const express = require('express')
const router = express.Router()


// First time use
router.get('/',(req,res) =>{
    //First Screen
    res.render('record_firsttime')
})

// export router to server.js
module.exports = router