const mongoose = require('mongoose')


const Books = mongoose.model('Books', {
    title: String,
    author: String,
    category: String,
    price: Number,
    sinopse: String,
    status: Boolean,
    date: String,
    edition: String,
    idSalesPerson: String

})

module.exports = Books