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

    try {
      const productsList = products.map(async (item) => {
        let searchedProduct = await Products.findByPk(item.id);
        searchedProduct = searchedProduct.toJSON();
        // console.log('11111111111', searchedProduct);

        if (searchedProduct === null) {
          return res.status(404).json({
            code: 404,
            message: `Item with id ${item.id} not found.`,
          });
        }

        const { id, name, flavor, complement, image, type, sub_type, price } = searchedProduct;
        const { qtd } = item;

        const newItem = { id, name, flavor, complement, image, type, sub_type, price, qtd };
        // console.log('2222222222', newItem);
        return newItem;
      });

      let newOrder = await Orders.create({ user_id, client_name, table });
      newOrder = newOrder.toJSON();

      productsList.forEach(async (item) => {
        await ProductsOrders.create({
          order_id: newOrder.id,
          product_id: item.id,
          qtd: item.qtd,
        });
      });

      const completeNewOrder = {
        ...newOrder,
        products: productsList,
      };

      return res.status(201).json(completeNewOrder);
    } catch (error) {
      return res.status(400).json(error);
    }
  }
}

module.exports = OrdersController;
