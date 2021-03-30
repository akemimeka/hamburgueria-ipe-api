/* eslint-disable arrow-body-style */
/* eslint-disable consistent-return */
/* eslint-disable camelcase */
const database = require('../db/models');

const { Orders, Products, ProductsOrders } = database;

class OrdersController {
  static async getAllOrders(_, res) {
    try {
      const orders = await Orders.findAll();

      const allOrders = orders.map(async (order) => {
        await Orders.findAll({
          where: { id: order.id },
        });

        const productsList = await ProductsOrders.findAll({
          where: { order_id: order.id },
          attributes: [['product_id', 'id'], 'qtd'],
        });

        const { id, user_id, client_name, table,
          status, createdAt, processedAt, updatedAt } = order;

        return {
          id,
          user_id,
          client_name,
          table,
          status,
          createdAt,
          processedAt,
          updatedAt,
          products: productsList,
        };
      });

      return res.status(200).json(allOrders);
    } catch (error) {
      return res.status(400).json({
        code: 400,
        message: error.message,
      });
    }
  }

  static async getOrder(req, res) {
    const findOrder = await Orders.findByPk(req.params.orderId);

    if (!findOrder) {
      return res.status(404).json({
        code: 404,
        message: "The order wasn't found.",
      });
    }

    try {
      const order = await Orders.findAll({
        where: { id: req.params.orderId },
      });

      const productsList = await ProductsOrders.findAll({
        where: { order_id: req.params.orderId },
        attributes: [['product_id', 'id'], 'qtd'],
      });

      // const productsInfo = productsList.map(async (product) => {
      //   await Products.findAll({
      //     where: { id: product.id },
      //     attributes: ['name'],
      //   });
      // });

      const { id, user_id, client_name, table,
        status, createdAt, processedAt, updatedAt } = order[0];

      const completeOrder = {
        id,
        user_id,
        client_name,
        table,
        status,
        createdAt,
        processedAt,
        updatedAt,
        products: productsList,
      };

      return res.status(200).json(completeOrder);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  static async createNewOrder(req, res) {
    const { user_id, client_name, table, products } = req.body;

    try {
      const newOrder = await Orders.create({
        user_id, client_name, table,
      });

      products.map(async (item) => {
        // const product = await Products.findByPk(item.id);

        // if (!product) {
        //   return res.status(400).json({
        //     code: 400,
        //     message: 'At least one of the items you ordered does not exist.',
        //   });
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
      return res.status(400).json(error);
    }
  }
}

module.exports = OrdersController;
