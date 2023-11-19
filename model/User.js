const mongoose = require('mongoose')

const User = mongoose.model('User', {
    name: String,
    email: String,
    password: String,
    status: Boolean,
    type: String,
    transaction: String
})


module.exports = User

