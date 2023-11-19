const mongoose = require('mongoose')

const Category = mongoose.model('Category', {
    categoryName: String,
    categoryDescription: String,
    status: Boolean
})


module.exports = Category

