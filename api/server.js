const express = require('express')
const helmet = require('helmet')
const cors = require('cors')
const restricted = require('./middleware/auth-middleware')

const authRouter = require('./auth/auth-router')
// const productsRouter = require('./products/products-router')

const server = express()

server.use(helmet())
server.use(cors())
server.use(express.json())

server.use('/api/auth', authRouter)
// server.use('/api/products', restricted, productsRouter)

// server.get('/', (req, res) => {
//     res.status(200).json('hello from server')
// })

server.use((err, req, res, next) => {
    res.status(err.status || 500).json({
        message: err.message,
        stack: err.stack
    })
  })

  module.exports = server