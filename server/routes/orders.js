const express = require('express');
const controller = require('../controller/orders');

const router = express.Router();
const { getAllOrders, getOrder, createNewOrder, updateOrder, deleteOrder } = controller;

router
  .route('/')
  .get(getAllOrders)
  .post(createNewOrder);

router
  .route('/:orderId')
  .get(getOrder)
  .put(updateOrder)
  .delete(deleteOrder);

module.exports = router;
