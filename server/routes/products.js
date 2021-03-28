const express = require('express');
const controller = require('../controller/products');

const router = express.Router();
const { getAllProducts, createNewProduct } = controller;

router
  .route('/')
  .get(getAllProducts)
  .post(createNewProduct);

router
  .route('/:productId')
  .get((req, res) => {
    res.send(`Pega dados do item ${req.params.productId}.`);
  })
  .put((req, res) => {
    res.send(`Atualiza item ${req.params.productId}.`);
  })
  .delete((req, res) => {
    res.send(`Deleta item ${req.params.productId}.`);
  });

module.exports = router;
