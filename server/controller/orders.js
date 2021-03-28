const database = require('../db/models');

const { Orders } = database;

class OrdersController {
  static async getAllOrders(_, res) {
    try {
      const orders = await Orders.findAll();
      return res.status(200).json(orders);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  static async createNewOrder(req, res) {
    try {
      const newOrder = await Orders.create(req.body);
      return res.status(201).json(newOrder);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}

module.exports = OrdersController;
