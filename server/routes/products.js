const express = require('express');
const controller = require('../controller/products');

const router = express.Router();
const { getAllProducts, createNewProduct, updateProduct } = controller;

router
  .route('/')
  .get(getAllProducts)
  .post(createNewProduct);

router
  .route('/:productId')
  .get((req, res) => {
    res.send(`Pega dados do item ${req.params.productId}.`);
  })
  .put(updateProduct)
  .delete((req, res) => {
    res.send(`Deleta item ${req.params.productId}.`);
  });

module.exports = router;
