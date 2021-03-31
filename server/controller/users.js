const database = require('../db/models');

const { Users } = database;

class UsersController {
  static async getAllUsers(_, res) {
    try {
      const users = await Users.findAll({
        attributes: { exclude: ['password', 'createdAt', 'updatedAt'] },
      });

      if (users.length === 0) {
        return res.status(404).json({
          code: 404,
          message: 'There are no registered users.',
        });
      }

      return res.status(200).json(users);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  static async getUser(req, res) {
    const findUser = await Users.findByPk(req.params.userId);

    if (!findUser) {
      return res.status(404).json({
        code: 404,
        message: 'User not found.',
      });
    }

    try {
      const user = await Users.findOne({
        where: { id: req.params.userId },
        attributes: { exclude: ['password', 'createdAt', 'updatedAt'] },
      });
      return res.status(200).json(user);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  static async createNewUser(req, res) {
    const { email, name, password, role, restaurant } = req.body;

    try {
      const findOrCreateUser = await Users.findOrCreate({
        where: { email },
        defaults: { name, email, password, role, restaurant },
      });

      const newUser = findOrCreateUser[0];
      const newEmail = findOrCreateUser[1];

      if (!newEmail) {
        return res.status(403).json({
          code: 403,
          message: 'The provided e-mail is already registered.',
        });
      }

      const returnedUser = await Users.findOne({
        where: { id: newUser.id },
        attributes: { exclude: ['password', 'createdAt', 'updatedAt'] },
      });

      return res.status(201).json(returnedUser);
    } catch (error) {
      return res.status(400).json({
        code: 400,
        message: error.message,
      });
    }
  }

  static async updateUser(req, res) {
    const { name, password, role } = req.body;

    try {
      const findUser = await Users.findByPk(req.params.userId);

      if (!findUser) {
        return res.status(404).json({
          code: 404,
          message: 'User not found.',
        });
      }

      await Users.update(
        { name, password, role },
        { where: { id: req.params.userId } },
      );

      const updatedUser = await Users.findOne({
        where: { id: req.params.userId },
        attributes: { exclude: ['password', 'createdAt', 'updatedAt'] },
      });

      return res.status(200).json(updatedUser);
    } catch (error) {
      return res.status(400).json({
        code: 400,
        error: error.message,
      });
    }
  }

  static async deleteUser(req, res) {
    const searchedUser = await Users.findByPk(req.params.userId);

    if (searchedUser === null) {
      return res.status(404).json({
        code: 404,
        message: 'User not found.',
      });
    }

    try {
      await Users.destroy({ where: { id: req.params.userId } });
      return res.status(200).json(`User with id ${req.params.userId} was deleted successfully.`);
    } catch (error) {
      return res.status(400).json({
        code: 400,
        error: error.message,
      });
    }
  }
}

module.exports = UsersController;
