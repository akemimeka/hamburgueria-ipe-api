const express = require('express');
const controller = require('../controller/orders');

const router = express.Router();
const { getAllOrders, getOrder, createNewOrder } = controller;

router
  .route('/')
  .get(getAllOrders)
  .post(createNewOrder);

router
  .route('/:orderId')
  .get(getOrder)
  .put()
  .delete();

module.exports = router;
