const express = require('express')
const router = express.Router()
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require('../config')
const mongodb = require('mongodb');


//load user model
const User = require('../model/Users')

router.get('/userRoute', (req, res) =>{
    return res.send({message: 'user route is working'})
})


//register
router.post('/register', (req, res) =>{
    const {name, email, image, bio, password} = req.body
    if(!name || !email || !image || !bio || !password){
        return res.send({error: 'All feilds are required'})
    }else{
        User.findOne({email}, (err, user) =>{
            if(err) throw err
            if(user){
                return res.send({error: 'Email already in use'})
            }else{
                var hash = bcrypt.hashSync(req.body.password)
                req.body.password = hash
                req.body.type = 'User'
                req.body.status = 'Active'
                User.create(req.body,(err, user) =>{
                    if(err) throw err
                    return res.send({message: "Your are registered"})
                })
            }
        })
    }
})

//login
router.post('/login', (req, res) =>{
    const {email, password} = req.body
    if(!email || !password){
        return res.send({error: "Both email and password is required"})
    }else{
        User.findOne({email}, (err, user) =>{
            if(err) throw err
            if(user){
                if(bcrypt.compareSync(password, user.password)){
                    User.updateOne({_id: user.id},{lastLogin: Date.now()}, (err, upadted) =>{
                        if(err) throw err
                        let token = jwt.sign({id: user.id}, config.secret, {expiresIn: 86400})
                        return res.status(200).send({token})
                    })
                }else{
                    return res.send({error: "Incorrect Password"})
                }
            }else{
                return res.send({error: "Email is not registered"})
            }
        })
    }
})

//user information
router.get('/userInfo', (req, res) => {
    let token = req.headers['x-access-token']
    if(!token) return res.status(500).send({error : "No token provided"})
    jwt.verify(token,config.secret, (err, data) => {
        if(err) return res.status(500).send({error : "Invalid Token"})
        User.findById(data.id,{password:0}, (err, user) => {
            res.send(user)
        })
    })
})

//activate user
router.put('/activateUser/:id', (req, res) => {
    let token = req.headers['x-access-token']
    if(!token) return res.status(500).send({error : "No token provided"})
    jwt.verify(token,config.secret, (err, data) => {
        if(err) return res.status(500).send({error : "Invalid Token"})
        User.findById(data.id,{password:0}, (err, user) => {
            let check = user.type
            console.log(check)
            if(check === "Admin"){
                User.findOne({_id: mongodb.ObjectId(req.params.id)}, (err, product) => {
                    if(err) throw err
                    User.updateOne({_id: mongodb.ObjectId(req.params.id)}, {status: "Active"}, (err, updated) => {
                        if(err) throw err
                        return res.send({message: "User activated successfully"})
                    })
                })
            }
            else{
                return res.send({error : 'You are not allowed to perform this action'})
            }
        })
    })
})


//deactivate category
router.put('/deactivateUser/:id', (req, res) => {
    let token = req.headers['x-access-token']
    if(!token) return res.status(500).send({error : "No token provided"})
    jwt.verify(token,config.secret, (err, data) => {
        if(err) return res.status(500).send({error : "Invalid Token"})
        User.findById(data.id,{password:0}, (err, user) => {
            let check = user.type
            console.log(check)
            if(check === "Admin"){
                User.findOne({_id: mongodb.ObjectId(req.params.id)}, (err, product) => {
                    if(err) throw err
                    User.updateOne({_id: mongodb.ObjectId(req.params.id)}, {status: "InActive"}, (err, updated) => {
                        if(err) throw err
                        return res.send({message: "user dectivated successfully"})
                    })
                })
            }
            else{
                return res.send({error : 'You are not allowed to perform this action'})
            }
        })
    })
})


// update user
router.put('/updateUser/:id', (req, res) => {
    let token = req.headers['x-access-token']
    if (!token) return res.status(500).send({ error: "No token provided" })
    jwt.verify(token, config.secret, (err, data) => {
        if (err) return res.status(500).send({ error: "Invalid Token" })
        User.findById(data.id, { password: 0 }, (err, user) => {
            let check = user.type
            let { name, image, email, bio, type } = req.body
            console.log(check)
            if (check === "Admin" || check === "Vendor") {
                User.findOne({ _id: mongodb.ObjectId(req.params.id) }, (err, product) => {
                    if (err) throw err
                    User.updateOne({ _id: mongodb.ObjectId(req.params.id) }, { name, image, email, bio, type }, (err, updated) => {
                        if (err) throw err
                        return res.send({ message: "Product updated successfully" })
                    })
                })
            }
        })
    })
})



//get all user
router.get('/allUsers', (req, res) => {
    User.find({}, (err, user) => {
        if(err) throw err
        return res.send(user)
    })
})


//get user by id
router.get('/getUser/:id', (req, res) => {
    User.find({_id: mongodb.ObjectId(req.params.id)}, (err, user) => {
        return res.send({user})
    })
})

module.exports = router