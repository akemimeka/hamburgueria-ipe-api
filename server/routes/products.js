const express = require('express');
const controller = require('../controller/products');

const router = express.Router();
const { getAllProducts, createNewProduct, getProduct, updateProduct, deleteProduct } = controller;

router
  .route('/')
  .get(getAllProducts)
  .post(createNewProduct);

router
  .route('/:productId')
  .get(getProduct)
  .put(updateProduct)
  .delete(deleteProduct);

module.exports = router;
