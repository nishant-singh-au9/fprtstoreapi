const express = require('express')
const router = express.Router()
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require('../config')
const mongodb = require('mongodb');

//load category models
const Brand = require('../model/Brand')

router.post('/addbrand', (req, res) => {
    let token = req.headers['x-access-token']
    if (!token) return res.status(500).send({ error: "No token provided" })
    jwt.verify(token, config.secret, (err, data) => {
        if (err) return res.status(500).send({ error: "Invalid Token" })
        User.findById(data.id, { password: 0 }, (err, user) => {
            let check = user.type
            console.log(check)
            if (check === "Admin" || check === "Vendor") {
                let { name, image } = req.body
                if (!name || !image) {
                    return res.send({ error: "All feilds are required" })
                } else {
                    Brand.create({name, image, status: "Active"}, (err, category) => {
                        if(err) throw err
                        return res.send({message: "Brand created successfully"})
                    })
                }
            }
            else {
                return res.send({ error: 'You are not allowed to perform this action' })
            }
        })
    })
})

//activate Brand
router.put('/activateBrand/:id', (req, res) => {
    let token = req.headers['x-access-token']
    if(!token) return res.status(500).send({error : "No token provided"})
    jwt.verify(token,config.secret, (err, data) => {
        if(err) return res.status(500).send({error : "Invalid Token"})
        User.findById(data.id,{password:0}, (err, user) => {
            let check = user.type
            console.log(check)
            if(check === "Admin"){
                Brand.findOne({_id: mongodb.ObjectId(req.params.id)}, (err, product) => {
                    if(err) throw err
                    Brand.updateOne({_id: mongodb.ObjectId(req.params.id)}, {status: "Active"}, (err, updated) => {
                        if(err) throw err
                        return res.send({message: "Brand activated successfully"})
                    })
                })
            }
            else{
                return res.send({error : 'You are not allowed to perform this action'})
            }
        })
    })
})


//deactivate Brand
router.put('/deactivateBrand/:id', (req, res) => {
    let token = req.headers['x-access-token']
    if(!token) return res.status(500).send({error : "No token provided"})
    jwt.verify(token,config.secret, (err, data) => {
        if(err) return res.status(500).send({error : "Invalid Token"})
        User.findById(data.id,{password:0}, (err, user) => {
            let check = user.type
            console.log(check)
            if(check === "Admin"){
                Brand.findOne({_id: mongodb.ObjectId(req.params.id)}, (err, product) => {
                    if(err) throw err
                    Brand.updateOne({_id: mongodb.ObjectId(req.params.id)}, {status: "InActive"}, (err, updated) => {
                        if(err) throw err
                        return res.send({message: "Brand deactivated successfully"})
                    })
                })
            }
            else{
                return res.send({error : 'You are not allowed to perform this action'})
            }
        })
    })
})


//get active categories
router.get('/activeBrand', (req, res) => {
    Brand.find({status: 'Active'},(err, data) => {
        if(err) throw err
        res.send(data)
    })
})


//get all brand
router.get('/allBrand', (req, res) => {
    Brand.find({},(err, data) => {
        if(err) throw err
        res.send(data)
    })
})



module.exports = router