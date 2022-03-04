const express = require('express');
const router = express.Router();
const Items = require('../products/products-model');
const { restricted } = require('../products/products-middleware');

router.get('/',restricted,async(req,res,next) => {
    try{
        const category = await Items.getCategory()
        res.json(category)
    }
    catch(err){
        next(err)
    }
})

module.exports = router