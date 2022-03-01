const express = require('express')
const Users = require('../users/users-model')
const jwt = require('jsonwebtoken')
const {jwtSecret} = require('../../config/secrets')

const restricted = (req, res, next) => {
    const token = req.headers.authorization
    if(!token){
        res.status(401)({ message: 'Token is required' })
    }
    jwt.verify(token, jwtSecret, (err, decoded) => {
        if(err){
            res.status(401).json({ message: 'Token invalid' + err.message })
        }else {
            req.decodedToken = decoded
        }
        next()
    })
}
const registerValidation = (req, res, next) => {
    const { username, password } = req.body
    if(username === undefined || username.trim() === ''){
        next({ status: 400, message: 'Please enter a username' })
    }else if (username.trim().length < 3){
        next({ status: 400, message: 'Username must be at least 3 characters'})
    }else if (password === undefined || password.trim() === ''){
        next({ status: 400, message: 'Please enter a password'})
    }else if (password.length < 4){
        next({ stauts: 400, message: 'Password must be a least 4 characters'})
    }else{
        next()
    }
}

const uniqueUsername = async(req, res, next) => {
    const { username } = req.body
    try{
        const existing = await Users.findByUsername({ username })
        if(!existing.length){
            next()
        }else {
            next({
                status: 422,
                message: 'This username already exists!'
            })
        }
    }catch(err){
        next(err)
    }
}

const loginValidation = async(req, res, next) => {
    const { username } = req.body
    const existingUser = await Users.findByUsername({ username })
    if(username === undefined || username.length < 3){
        next({ status: 400, message: 'Username must exist and be more than 3 characters'})
    }else if(typeof username !== 'string'){
        res.status(400).json({ message: 'Username must not be a number'})
    }else if(!existingUser){
        res.sataus(404).json({ message: 'Username does not exist'})
    }else{
        req.user = existingUser
        next()
    }
}

module.exports = {
    restricted,
    loginValidation,
    registerValidation,
    uniqueUsername,
}