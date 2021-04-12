const mongoose = require('mongoose')
const Schema = mongoose.Schema

const BrandSchema = new Schema({
    name: { type: 'string', required: true},
    image: { type: 'string', required: true},
    status: { type: 'string', required: true}
})


module.exports = Brand = mongoose.model("brands", BrandSchema)