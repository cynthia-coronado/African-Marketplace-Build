const express = require("express")
const Users = require('./users-model')
const {tokenMaker } = require('../../config/secrets')
const bcrypt = require('bcryptjs')
const router = express.Router()
const {
    registerValidation, 
    uniqueUsername,
    loginValidation,
} = require('../auth/auth-middleware')

router.post('/register', registerValidation, uniqueUsername, async (req,res,next) => {
    try{
        const {username,password,role_name} = req.body
        const hash = bcrypt.hashSync(password,8)
        const response = await Users.create({username,password:hash,role_name})
        res.status(201).json(response)
    }
    catch(err){
        next(err)
    }
})

router.post('/login', loginValidation, uniqueUsername, async (req,res,next)=> {
    try{
        const {password} = req.body
        if(bcrypt.compareSync(password,req.user.password)){
            const token = tokenMaker(req.user)
            res.status(200).json({message: `Welcome ${req.body.username}!`,token})
        }
        else{
            res.status(401).json({message:'Invalid credentials'})
        }    
    }
    catch(err){
        next(err)
    }

})


module.exports = router