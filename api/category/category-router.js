const express = require('express');
const router = express.Router();
const Items = require('../Products/product-model');
const { restricted } = require('../Products/product-middleware');

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