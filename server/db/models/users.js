const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    static associate(models) {
      Users.hasMany(models.Orders, {
        foreignKey: 'user_id',
      });
    }
  }

  Users.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'The name field cannot be empty.' },
        notNull: { msg: 'A name is required.' },
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: { msg: 'The e-mail typed is invalid.' },
        notEmpty: { msg: 'The e-mail field cannot be empty.' },
        notNull: { msg: 'An e-mail is required.' },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'The password field cannot be empty.' },
        notNull: { msg: 'A password is required.' },
        len: { args: [6, 30], msg: 'The password must have at least 6 characters.' },
      },
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'The role field cannot be empty.' },
        notNull: { msg: 'A role is required.' },
      },
    },
    restaurant: {
      type: DataTypes.STRING,
      defaultValue: 'Hamburgueria Ipê',
    },
  }, {
    sequelize,
    modelName: 'Users',
  });
  return Users;
};
