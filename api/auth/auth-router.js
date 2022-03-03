const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const Users = require('../users/users-model')
const tokenBuilder = require('./token-builder')

router.use(express.json());

const { 
    loginValidation, 
    registerValidation, 
    uniqueUsername, 
} = require('../middleware/auth-middleware')

router.get('/', (req, res, next) => {
    res.send('getting from auth-router')
})

router.post('/register', registerValidation, uniqueUsername, async (req, res, next) => {
    let user = req.body
    const hash = bcrypt.hashSync(user.password, 8)
    user.password = hash
    try{
        const newUser = await Users.create(user)
        res.status(201).json(newUser)
    }catch(err){
        next(err)
    }
})

router.post('/login', loginValidation, async (req, res, next) => {
    const { password } = req.body;
    const { user } = req; 
    const validUser = bcrypt.compareSync(password, user.password);
    if (validUser) {
      const token = tokenBuilder(user)
      res.status(200).json({ message: `Welcome Back, ${user.username}`, token});
    } else {
        next({ status: 401, message: 'Invalid Credentials. Please try again or register!'})
    }
  });

module.exports = router