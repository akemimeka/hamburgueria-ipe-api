const database = require('../db/models');

const { Orders, ProductsOrders } = database;

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

      req.body.products.forEach(async (item) => {
        // const product = await Products.findByPk(item.id);
        // if (!product) {
        //   return res.status(400).json("The product you ordered wasn't found.");
        // }

        const newProductOrder = {
          order_id: newOrder.id,
          product_id: item.id,
          qtd: item.qtd,
        };

        await ProductsOrders.create(newProductOrder);
      });
      return res.status(201).json(newOrder);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}

module.exports = OrdersController;
