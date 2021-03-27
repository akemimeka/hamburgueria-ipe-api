const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ProductsOrders extends Model {
    static associate(models) {
      ProductsOrders.hasMany(models.Orders, {
        foreignKey: 'order_id',
      });
      ProductsOrders.hasMany(models.Products, {
        foreignKey: 'product_id',
      });
    }
  }

  ProductsOrders.init({
    order_id: DataTypes.INTEGER,
    product_id: DataTypes.INTEGER,
    qtd: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'ProductsOrders',
  });
  return ProductsOrders;
};
