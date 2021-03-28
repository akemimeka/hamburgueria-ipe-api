const database = require('../db/models');

const { Products } = database;

class ProductsController {
  static async getAllProducts(_, res) {
    try {
      const products = await Products.findAll();
      return res.status(200).json(products);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  static async createNewProduct(req, res) {
    try {
      const newProduct = await Products.create(req.body);
      return res.status(201).json(newProduct);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}

module.exports = ProductsController;
