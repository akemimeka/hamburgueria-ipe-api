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

  static async updateProduct(req, res) {
    try {
      await Products.update(
        {
          name: req.body.name,
          price: req.body.price,
          flavor: req.body.flavor,
          complement: req.body.complement,
          image: req.body.image,
          type: req.body.type,
          sub_type: req.body.sub_type,
        },
        { where: { id: req.params.productId } },
      );

      const updatedProduct = await Products.findAll({
        where: { id: req.params.productId },
      });
      return res.status(200).json(updatedProduct);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}

module.exports = ProductsController;
