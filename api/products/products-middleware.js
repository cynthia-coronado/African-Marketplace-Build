const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../../config/secrets');
const db = require('../../data/db-config');
const Items = require('./products-model');

const restricted = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return next({
      status: 401,
      message: 'Token required'
    });
  }
  jwt.verify(token, jwtSecret , (err, decodedToken) => {
    if (err) {
      next({
        status: 401,
        message: 'Token invalid'
      });
    } else {
      req.decodedToken = decodedToken;
      next();
    }
  });
};

const invalidCategory = async (req, res, next) => {
  const { id } = req.params;
  const category_id = await db('category as c')
    .where('category_id', id)
    .first();

  if (!category_id) {
    next({
      status: 400,
      message: 'Invalid Category'
    });
  } else {
    next();
  }
};

const checkProductBody = (req,res,next) => {
  const {product,price,category} = req.body
  if(!product || !price || !category){
    next({
      status:400,
      message:"Product name, price and category are required"
    })
  } 
  next()
}

const checkProductExists = async (req,res,next) => {
  const { id } = req.params;
  const product = await Items.getProductById(id);
    if (!product) {
      res.status(404).json({
        message: 'the product does not exist'
      });
    } 
    else{
      req.product = product
      next()
    }
}


module.exports = {
  restricted,
  invalidCategory,
  checkProductBody,
  checkProductExists
};