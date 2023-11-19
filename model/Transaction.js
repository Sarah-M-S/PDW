const mongoose = require('mongoose')

const Transaction = mongoose.model('Transaction', {
    buyerId: String,
    sellerId: String,
    itemId: String,
    date: String,
    price: Number
})


module.exports = Transaction

