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
    restricted
} = require('../middleware/auth-middleware')

router.get('/', (req, res, next) => {
    res.send('getting from auth-router')
})

module.exports = router