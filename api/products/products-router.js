const express = require('express');
const router = express.Router();
const Items = require('./products-model');
const { 
  restricted,
  invalidCategory,
  checkProductBody
} = require('./products-middleware');

router.get('/:id', restricted, invalidCategory, (req, res, next) => {
  const { id } = req.params;
  Items.getProducts(id)
    .then(item => {
      res.json(item);
    })
    .catch(next);
});

router.post('/', restricted, checkProductBody, async (req, res, next) => {
  try {
    const resp = await Items.addProduct(req.body);
    res.status(201).json(resp);
  }
  catch (err) {
    next(err);
  }
});

router.delete('/:id', restricted, async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProduct = await Items.getProductById(id);
    if (!deletedProduct) {
      res.status(404).json({
        message: 'the product does not exist'
      });
    } else {
      res.json(deletedProduct);
      await Items.remove(id);
    }
  }
  catch {
    res.status(500).json({
      message: 'the product could not be deleted'
    });
  }
});

router.put('/:product_id',restricted, async (req, res, next) => {
  try {
    const { product_id } = req.params;
    const newProduct = await Items.insertProduct(product_id, req.body);
    res.status(200).json(newProduct);
  }
  catch (err) {
    next(err);
  }
});


module.exports = router;