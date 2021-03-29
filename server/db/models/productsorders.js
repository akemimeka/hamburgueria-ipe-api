const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ProductsOrders extends Model {}

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
