require('dotenv').config();
import jwt from 'jsonwebtoken';
import * as Yup from 'yup';
import User from '../models/User';
import authConfig from '../../config/auth';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import Queue from '../lib/Queue';

class SessionController {
  async store(req, res) {
    try {
      const schema = Yup.object().shape({
        email: Yup.string().email().required(),
        password: Yup.string().required(),
      });

      if (!(await schema.isValid(req.body))) {
        return res.status(400).json({ error: 'Validation fails' });
      }

      const { email, password } = req.body;
      const user = await User.findOne({
        where: { email },
        include: [
          {
            association: 'avatar',
            attributes: ['id', 'path'],
          },
        ],
      });

      if (!user) {
        return res.status(401).send({ msg: 'msg: User not found' });
      }

      if (!(await user.checkPassword(password))) {
        return res.status(401).send({ msg: 'msg: Password does not match' });
      }

      const { id, name, avatar } = user;

      console.log('chegou aqui');
      return res.json({
        user: {
          id,
          name,
          email,
          avatar,
          token: jwt.sign({ id }, authConfig.secret, {
            expiresIn: authConfig.expiresIn,
          }),
        },
      });
    } catch (err) {
      return console.log(err);
    }
  }

  async forgotPassword(req, res) {
    const { email } = req.body;

    try {
      const user = await User.findOne({
        where: { email },
      });

      if (!user) {
        return res.status(400).send({ msg: 'user not found' });
      }
      //   const secret = process.env.APP_SECRET + user.password;

      const token = crypto.randomBytes(20).toString('hex');

      console.log('esse é o token:', token);

      const now = new Date();
      now.setHours(now.getHours() + 1);

      const link = `http://localhost:3000/reset_password/${token}`;

      await User.update(
        {
          password_reset_token: token,
          password_reset_expires: now,
        },
        { where: { email } }
      );

      await Queue.add('RegistrationMail', { user, link });

      return res
        .status(200)
        .send({ msg: `msg enviada para o seu email de nome ${email}` });
    } catch (err) {
      console.log(err);
      return res.status(400).send({ msg: err });
    }
  }
  async resetPassword(req, res) {
    const { token } = req.params;
    const userIsAuthorized = await User.findOne({
      where: { password_reset_token: token },
    });

    if (!userIsAuthorized) {
      return res.status(401).send({
        msg: 'Invalid user or token, you not have permit to access this link',
      });
    }

    const now = new Date();

    if (now > userIsAuthorized.password_reset_expires) {
      return res
        .status(400)
        .json({ error: 'token expired, generate a new one' });
    }

    //  const secret = process.env.APP_SECRET + user.password;

    try {
      //  const verify = jwt.verify(token, secret);
      return res.send('ok');
    } catch (err) {
      return res.send('Not verified');
    }
  }

  async confirmResetPassword(req, res) {
    const { newPassword, token } = req.body;

    try {
      const userIsAuthorized = await User.findOne({
        where: { password_reset_token: token },
      });

      if (!userIsAuthorized) {
        return res.status(401).send({
          msg: 'Invalid token',
        });
      }

      const now = new Date();

      if (now > userIsAuthorized.password_reset_expires) {
        return res
          .status(400)
          .json({ error: 'token expired, generate a new one' });
      }

      const hashNewPassword = await bcrypt.hash(newPassword, 8);

      await User.update(
        {
          password_hash: hashNewPassword,
          password_reset_token: null,
          password_reset_expires: null,
        },
        {
          where: {
            password_reset_token: token,
          },
        }
      );

      return res.status(200).send({ msg: `password atualizado com sucesso` });
    } catch (err) {
      return res.status(400).send({ msg: err });
    }
  }
}

export default new SessionController();
