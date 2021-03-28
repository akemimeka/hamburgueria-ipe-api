const express = require('express');
const controller = require('../controller/orders');

const router = express.Router();
const { getAllOrders, createNewOrder } = controller;

router
  .route('/')
  .get(getAllOrders)
  .post(createNewOrder);

router
  .route('/:orderId')
  .get((req, res) => {
    res.send(`Pega dados do pedido ${req.params.productId}.`);
  })
  .put((req, res) => {
    res.send(`Atualiza pedido ${req.params.productId}.`);
  })
  .delete((req, res) => {
    res.send(`Deleta pedido ${req.params.productId}.`);
  });

module.exports = router;
