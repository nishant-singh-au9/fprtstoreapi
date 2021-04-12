const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const port = process.env.PORT || 5600
const db = require('./db')

const users = require('./routes/users')
const products = require('./routes/products')
const categories = require('./routes/categories')
const brands = require('./routes/brands')

app.use(cors())
app.use(
  express.urlencoded({
    extended: false
  })
);
app.use(express.json());

app.use('/api/users', users)
app.use('/api/products', products)
app.use('/api/categories', categories)
app.use('/api/brands', brands)


app.get('/', (req, res) => {
    return res.send({message: 'Server is running fine'})
})



app.listen(port,(err) => {
    if (err) throw err
    console.log(`server is running at ${port}!`)
})