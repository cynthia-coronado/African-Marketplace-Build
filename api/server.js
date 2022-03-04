const express = require('express')
const helmet = require('helmet')
const cors = require('cors')
const usersRouter = require('./users/users-router')
const productRouter = require('./products/product-router')
const categoryRouter = require('./category/category-router')
const Users = require('./users/users-model')

const server = express();
server.use(express.json());
server.use(helmet());
server.use(cors());
server.use('/api/auth', usersRouter);
server.use('/api/products', productRouter);
server.use('/api/category', categoryRouter);


server.get('/',(req, res) => {
  res.status(200).json("Welcome to African marketplace API");
});

server.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message
  });
});

module.exports = server;