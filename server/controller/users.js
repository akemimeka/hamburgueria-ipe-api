const database = require('../db/models');

const { Users } = database;

class UsersController {
  static async getAllUsers(_, res) {
    try {
      const users = await Users.findAll({
        attributes: { exclude: ['password'] },
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
        message: "The user wasn't found.",
      });
    }

    try {
      const user = await Users.findAll({
        where: { id: req.params.userId },
        attributes: { exclude: ['password'] },
      });
      return res.status(200).json(user);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  static async createNewUser(req, res) {
    const takenEmail = await Users.findAll({
      where: { email: req.body.email },
    });

    if (takenEmail) {
      return res.status(403).json({
        code: 403,
        message: 'The provided e-mail is already in use.',
      });
    }

    try {
      const newUser = await Users.create(req.body);
      return res.status(201).json(newUser);
    } catch (error) {
      return res.status(400).json({
        code: 400,
        message: error.message,
      });
    }
  }

  static async updateUser(req, res) {
    const findUser = await Users.findByPk(req.params.userId);

    if (!findUser) {
      return res.status(404).json({
        code: 404,
        message: "The user wasn't found.",
      });
    }

    try {
      await Users.update(
        {
          name: req.body.name,
          password: req.body.password,
          role: req.body.role,
        },
        { where: { id: req.params.userId } },
      );

      const updatedUser = await Users.findAll({
        where: { id: req.params.userId },
        attributes: { exclude: ['password'] },
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
    const findUser = await Users.findByPk(req.params.userId);

    if (!findUser) {
      return res.status(404).json({
        code: 404,
        message: "The user wasn't found.",
      });
    }

    try {
      await Users.destroy({
        where: { id: req.params.userId },
      });
      return res.status(200).json('The user was deleted successfully.');
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}

module.exports = UsersController;
