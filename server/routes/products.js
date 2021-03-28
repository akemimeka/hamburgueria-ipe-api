const express = require('express');
const controller = require('../controller/products');

const router = express.Router();
const { getAllProducts, createNewProduct, getProduct, updateProduct } = controller;

router
  .route('/')
  .get(getAllProducts)
  .post(createNewProduct);

router
  .route('/:productId')
  .get(getProduct)
  .put(updateProduct)
  .delete((req, res) => {
    res.send(`Deleta item ${req.params.productId}.`);
  });

module.exports = router;
