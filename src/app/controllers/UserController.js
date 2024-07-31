import * as Yup from 'yup';
import User from '../models/User';
import Queue from '../lib/Queue';

import { v2 as cloudinary } from 'cloudinary';
import { v4 as uuidv4 } from 'uuid';
import CloudiNaryConfig from '../../config/cloudinaryConfig';
import { Op } from 'sequelize';
require('dotenv').config();

CloudiNaryConfig;

class UserController {
  async store(req, res) {
    try {
      console.log(req.body);
      const schema = Yup.object().shape({
        name: Yup.string().required(),
        surname: Yup.string().required(),
        email: Yup.string().email().required(),
        //   permitted_to_add_in_groups: Yup.boolean().required(),
        password: Yup.string().required().min(6),
      });

      if (!(await schema.isValid(req.body))) {
        return res.status(400).json({ error: 'Validation fails' });
      }

      const userExists = await User.findOne({
        where: { email: req.body.email },
      });

      if (userExists) {
        return res.status(400).json({ error: 'User already exists' });
      }
      const { id, name, surname, email, password } = req.body;

      const userCreated = await User.create({
        id,
        name,
        surname,
        email,
        password,
        permitted_to_add_in_groups: true,
      });

      return res.status(201).json(userCreated);
    } catch (err) {
      console.log(err);
      return res.status(400).json({ erro: err });
    }
  }

  async update(req, res) {
    try {
      const { user_id } = req.params;

      const findUser = await User.findOne({ where: { id: user_id } });

      if (findUser.id !== req.userId)
        return res
          .status(401)
          .json({ error: 'Invalid action. You are not this user' });

      // const schema = Yup.object().shape({
      //   name: Yup.string(),
      //   email: Yup.string().email(),
      //   permitted_to_add_in_groups: Yup.boolean(),
      //   oldPassword: Yup.string().min(6),
      //   password: Yup.string()
      //     .min(6)
      //     .when('oldPassword', (oldPassword, field) =>
      //       oldPassword ? field.required() : field
      //     ),
      //   confirmPassword: Yup.string().when('password', (password, field) =>
      //     password ? field.required().oneOf([Yup.ref('password')]) : field
      //   ),
      // });

      // if (!(await schema.isValid(req.body))) {
      //   return res.status(400).json({ error: 'Validation fails' });
      // }

      // const { email, oldPassword } = req.body;

      const user = await User.findByPk(req.userId);

      // if (email !== user.email) {
      //   const userExists = await User.findOne({
      //     where: { email },
      //   });
      //   if (userExists) {
      //     return res.status(400).json({ error: 'User already exists' });
      //   }
      // }

      // if (oldPassword && !(await user.checkPassword(oldPassword))) {
      //   return res.status(401).json({ error: 'Password does not match' });
      // }

      const { path } = req.file;

      const avatar = await cloudinary.uploader.upload(path, {
        folder: process.env.IMAGES_FOLDER,
      });

      console.log(avatar);
      return res.send(true);

      // await File.create( {

      // })

      // await user.update({
      //   avatar_id: newAvatar.secure_url,
      // });

      // return res.send({
      //   msg: 'User successfully updated',

      //   avavatar_id,
      // });
    } catch (err) {
      return err;
    }
  }

  async index(req, res) {
    const { name } = req.params;

    console.log('name', name);

    try {
      const findUsers = await User.findAll({
        attributes: ['id', 'name', 'email', 'permitted_to_add_in_groups'],
        order: [['created_at', 'DESC']],
        where: {
          name: {
            [Op.like]: `%${name}%`,
          },
        },
        include: [
          {
            association: 'avatar',
            attributes: ['id', 'path'],
          },
        ],
      });
      if (!findUsers) return res.status(400).json({ error: 'No users found' });

      return res.status(200).json(findUsers);
    } catch (err) {
      console.log(err);
    }
  }

  async show(req, res) {
    const { user_id } = req.params;
    const findUser = await User.findByPk(user_id, {
      attributes: ['id', 'name', 'email', 'permitted_to_add_in_groups'],
      order: ['id'],
    });

    if (!findUser) return res.status(400).json({ error: 'User not  found' });

    return res.status(200).json(findUser);
  }

  async delete(req, res) {
    const { user_id } = req.params;

    try {
      const findUser = await User.findOne({ where: { id: user_id } });

      if (findUser.id !== req.userId)
        return res
          .status(401)
          .json({ error: 'Invalid action. You are not this user' });

      await User.destroy({
        where: { id: req.userId },
      });

      return res
        .status(200)
        .json({ msg: 'your account was successfully deleted' });
    } catch (err) {
      console.log(err);
    }
  }
}

export default new UserController();
