/* eslint-disable camelcase */
const database = require('../db/models');

const { Products } = database;

class ProductsController {
  static async getAllProducts(_, res) {
    try {
      const products = await Products.findAll({
        order: [['id', 'ASC']],
        attributes: { exclude: ['password', 'createdAt', 'updatedAt'] },
      });
      return res.status(200).json(products);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  static async getProduct(req, res) {
    try {
      const product = await Products.findOne({
        where: { id: req.params.productId },
        attributes: { exclude: ['password', 'createdAt', 'updatedAt'] },
      });
      return res.status(200).json(product);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  static async createNewProduct(req, res) {
    const { name, price, flavor, complement, image, type, sub_type } = req.body;

    try {
      const newProduct = await Products.create({
        name, price, flavor, complement, image, type, sub_type,
      });

      const returnedProduct = await Products.findOne({
        where: { id: newProduct.id },
        attributes: { exclude: ['createdAt', 'updatedAt'] },
      });

      return res.status(201).json(returnedProduct);
    } catch (error) {
      return res.status(400).json(error);
    }
  }

  static async updateProduct(req, res) {
    const { name, price, flavor, complement, image, type, sub_type } = req.body;

    try {
      const findProduct = await Products.findByPk(req.params.productId);

      if (!findProduct) {
        return res.status(404).json('Product not found.');
      }

      await Products.update(
        { name, price, flavor, complement, image, type, sub_type },
        { where: { id: req.params.productId } },
      );

      const updatedProduct = await Products.findOne({
        where: { id: req.params.productId },
        attributes: { exclude: ['createdAt', 'updatedAt'] },
      });

      return res.status(200).json(updatedProduct);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  static async deleteProduct(req, res) {
    try {
      const productToDelete = await Products.destroy({
        where: { id: req.params.productId },
      });

      if (!productToDelete) {
        return res.status(404).json('Product not found.');
      }

      return res.status(200).json(`Product with id ${req.params.productId} was deleted successfully.`);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}

module.exports = ProductsController;
