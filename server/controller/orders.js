/* eslint-disable camelcase */
const database = require('../db/models');

const { Users, Orders, Products, ProductsOrders } = database;

class OrdersController {
  static async getAllOrders(_, res) {
    try {
      let allOrders = await Orders.findAll({
        include: {
          model: Products,
          as: 'products',
          attributes: ['id', 'name', 'flavor', 'complement', 'image', 'type', 'sub_type', 'price'],
          through: {
            model: ProductsOrders,
            as: 'qtd',
            attributes: ['qtd'],
          },
        },
      });

      if (allOrders.length === 0) {
        return res.status(404).json({
          code: 404,
          message: 'No orders were found.',
        });
      }

      allOrders = JSON.parse(JSON.stringify(allOrders));

      const returnedOrders = allOrders.map((order) => {
        const productsList = order.products.map((product) => ({
          ...product,
          qtd: product.qtd.qtd,
        }));

        return {
          ...order,
          products: productsList,
        };
      });

      return res.status(200).json(returnedOrders);
    } catch (error) {
      return res.status(400).json({
        code: 400,
        message: error.message,
      });
    }
  }

  static async getOrder(req, res) {
    const searchedOrder = await Orders.findByPk(req.params.orderId);

    if (searchedOrder === null) {
      return res.status(404).json({
        code: 404,
        message: 'Order not found.',
      });
    }

    try {
      let order = await Orders.findOne({
        where: { id: req.params.orderId },
        include: {
          model: Products,
          as: 'products',
          attributes: ['id', 'name', 'flavor', 'complement', 'image', 'type', 'sub_type', 'price'],
          through: {
            model: ProductsOrders,
            as: 'qtd',
            attributes: ['qtd'],
          },
        },
      });

      order = order.toJSON();

      const orderedItems = order.products.map((product) => ({
        ...product,
        qtd: product.qtd.qtd,
      }));

      const completeOrder = {
        ...order,
        products: orderedItems,
      };

      return res.status(200).json(completeOrder);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  static async createNewOrder(req, res) {
    const { user_id, client_name, table, products } = req.body;
    const searchedUser = await Users.findByPk(user_id);

    if (!searchedUser) {
      return res.status(404).json({
        code: 404,
        message: 'User not found.',
      });
    }

    try {
      let productsList = products.map(async (item) => {
        const searchedProduct = await Products.findByPk(item.id);

        if (searchedProduct === null) {
          throw new Error(`Product with id ${item.id} was not found.`);
        }

        const { qtd } = item;
        const { id, name, flavor, complement, image, type, sub_type, price } = searchedProduct;
        const newItem = { id, name, flavor, complement, image, type, sub_type, price, qtd };

        return newItem;
      });

      productsList = await Promise.all(productsList);

      let newOrder = await Orders.create({ user_id, client_name, table });
      newOrder = newOrder.toJSON();
      const { id, status, createdAt, updatedAt, processedAt } = newOrder;

      const orderedItems = products.map((item) => ({
        order_id: newOrder.id,
        product_id: item.id,
        qtd: item.qtd,
      }));

      await ProductsOrders.bulkCreate(orderedItems);

      const completeNewOrder = {
        id,
        user_id,
        client_name,
        table,
        status,
        createdAt,
        updatedAt,
        processedAt,
        products: productsList,
      };

      return res.status(201).json(completeNewOrder);
    } catch (error) {
      return res.status(400).json({
        code: 400,
        message: error.message,
      });
    }
  }

  static async updateOrder(req, res) {
    const { user_id, client_name, table, status, processedAt } = req.body;
    const searchedOrder = await Orders.findByPk(req.params.orderId);
    const searchedUser = await Users.findByPk(user_id);

    if (searchedOrder === null) {
      return res.status(404).json({
        code: 404,
        message: 'Order not found.',
      });
    }

    if (!searchedUser) {
      return res.status(404).json({
        code: 404,
        message: 'User not found.',
      });
    }

    try {
      await Orders.update(
        { user_id, client_name, table, status, processedAt },
        { where: { id: req.params.orderId } },
      );

      const updatedOrder = await Orders.findByPk(req.params.orderId);
      return res.status(200).json(updatedOrder);
    } catch (error) {
      return res.status(400).json(error);
    }
  }

  static async deleteOrder(req, res) {
    const searchedOrder = await Orders.findByPk(req.params.orderId);

    if (searchedOrder === null) {
      return res.status(404).json({
        code: 404,
        message: 'Order not found.',
      });
    }

    try {
      await ProductsOrders.destroy({ where: { order_id: req.params.orderId } });
      await Orders.destroy({ where: { id: req.params.orderId } });
      return res.status(200).json(`Order with id ${req.params.orderId} was deleted successfully.`);
    } catch (error) {
      return res.status(400).json(error);
    }
  }
}

module.exports = OrdersController;
