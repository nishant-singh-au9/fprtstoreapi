const express = require('express')
const router = express.Router()
const jwt = require("jsonwebtoken");
const config = require('../config')
const mongodb = require('mongodb');

//load product models
const Product = require('../model/Products')



router.post('/addproduct', (req, res) => {
    let token = req.headers['x-access-token']
    if (!token) return res.status(500).send({ error: "No token provided" })
    jwt.verify(token, config.secret, (err, data) => {
        if (err) return res.status(500).send({ error: "Invalid Token" })
        User.findById(data.id, { password: 0 }, (err, user) => {
            let check = user.type
            let { name, image, quantity, brand, category, price } = req.body
            let vendorEmail = user.email
            console.log(check)
            if (check === "Admin" || check === "Vendor") {
                Product.create({
                    name, image, vendorEmail, quantity, status: 'Active', brand, price, category
                }, (err, product) => {
                    if (err) throw err
                    return res.send({ message: "Product listed successfully" })
                })
            }
            else {
                return res.send({ error: 'You are not allowed to perform this action' })
            }
        })
    })
})

//get product
router.get('/getProduct/:id', (req, res) => {

    Product.findOne({ _id: mongodb.ObjectId(req.params.id) }, (err, product) => {
        if (err) throw err
        return res.send(product)
    })

})


// update product
router.put('/updateProduct/:id', (req, res) => {
    let token = req.headers['x-access-token']
    if (!token) return res.status(500).send({ error: "No token provided" })
    jwt.verify(token, config.secret, (err, data) => {
        if (err) return res.status(500).send({ error: "Invalid Token" })
        User.findById(data.id, { password: 0 }, (err, user) => {
            let check = user.type
            let { name, image, quantity, price } = req.body
            console.log(check)
            if (check === "Admin" || check === "Vendor") {
                Product.findOne({ _id: mongodb.ObjectId(req.params.id) }, (err, product) => {
                    if (err) throw err
                    Product.updateOne({ _id: mongodb.ObjectId(req.params.id) }, { name, image, quantity, price }, (err, updated) => {
                        if (err) throw err
                        return res.send({ message: "Product updated successfully" })
                    })
                })
            }
        })
    })
})


//activate product
router.put('/activateProduct/:id', (req, res) => {
    let token = req.headers['x-access-token']
    if (!token) return res.status(500).send({ error: "No token provided" })
    jwt.verify(token, config.secret, (err, data) => {
        if (err) return res.status(500).send({ error: "Invalid Token" })
        User.findById(data.id, { password: 0 }, (err, user) => {
            let check = user.type
            console.log(check)
            if (check === "Admin" || check === "Vendor") {
                Product.findOne({ _id: mongodb.ObjectId(req.params.id) }, (err, product) => {
                    if (err) throw err
                    Product.updateOne({ _id: mongodb.ObjectId(req.params.id) }, { status: "Active" }, (err, updated) => {
                        if (err) throw err
                        return res.send({ message: "Product activated successfully" })
                    })
                })
            }
            else {
                return res.send({ error: 'You are not allowed to perform this action' })
            }
        })
    })
})

//deactivate products
router.put('/deactivateProduct/:id', (req, res) => {
    let token = req.headers['x-access-token']
    if (!token) return res.status(500).send({ error: "No token provided" })
    jwt.verify(token, config.secret, (err, data) => {
        if (err) return res.status(500).send({ error: "Invalid Token" })
        User.findById(data.id, { password: 0 }, (err, user) => {
            let check = user.type
            console.log(check)
            if (check === "Admin" || check === "Vendor") {
                Product.findOne({ _id: mongodb.ObjectId(req.params.id) }, (err, product) => {
                    if (err) throw err
                    Product.updateOne({ _id: mongodb.ObjectId(req.params.id) }, { status: "InActive" }, (err, updated) => {
                        if (err) throw err
                        return res.send({ message: "Product deactivated successfully" })
                    })
                })
            }
            else {
                return res.send({ error: 'You are not allowed to perform this action' })
            }
        })
    })
})

//get all active product

router.get('/', (req, res) => {
    Product.find({status: 'Active'}, (err, product) => {
        return res.send({ product })
    })
})


//get all product

router.get('/allproducts', (req, res) => {
    Product.find({}, (err, product) => {
        return res.send({ product })
    })
})


//get product by vendor
router.get('/vendorProduct', (req, res) => {
    let token = req.headers['x-access-token']
    if (!token) return res.status(500).send({ error: "No token provided" })
    jwt.verify(token, config.secret, (err, data) => {
        if (err) return res.status(500).send({ error: "Invalid Token" })
        User.findById(data.id, { password: 0 }, (err, user) => {
            Product.find({ vendorEmail: user.email }, (err, product) => {
                if (err) throw err
                return res.send(product)
            })
        })
    })
})


//serach by name
router.get('/search/:name', (req, res) => {
    let regex = new RegExp(req.params.name, 'i')
    Product.find({ name: regex}, (err, product) => {
        if(err) throw err
        return res.send(product)
    })
})




// router.get('/', (req, res) => {
//     let token = req.headers['x-access-token']
//     if(!token) return res.status(500).send({error : "No token provided"})
//     jwt.verify(token,config.secret, (err, data) => {
//         if(err) return res.status(500).send({error : "Invalid Token"})
//         User.findById(data.id,{password:0}, (err, user) => {
//             let check = user.type
//             console.log(check)
//             if(check === "Admin" || check === "Vendor"){

//             }
//             else{
//                 return res.send({error : 'You are not allowed to perform this action'})
//             }
//         })
//     })
// })






module.exports = router