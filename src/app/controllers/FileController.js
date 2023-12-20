import File from '../models/File';
import User from '../models/User';
import Group from '../models/Group';
import { v2 as cloudinary } from 'cloudinary';
import CloudiNaryConfig from '../../config/cloudinaryConfig';
import { v4 as uuidv4 } from 'uuid';
require('dotenv').config();

CloudiNaryConfig;

class SessionController {
  async store(req, res) {
    try {
      const { path } = req.file;
      const { group_id } = req.params;

      const response = await cloudinary.uploader.upload(path, {
        folder: process.env.IMAGES_FOLDER,
      });

      const isMember = await User.findOne({
        where: { id: req.userId },
        include: [
          {
            association: 'avatar',
          },
        ],
      });

      //  console.log(isMember.dataValues.user_avatar_id);

      const getFile = await File.findOne({
        where: { id: isMember.dataValues.user_avatar_id },
      });

      if (getFile) {
        await File.destroy({ where: { id: getFile.dataValues.id } });
        await cloudinary.uploader.destroy(getFile.dataValues.public_id);
      }

      console.log(getFile);
      const newFile = await File.create({
        id: uuidv4(),
        public_id: response.public_id,
        name: response.original_filename,
        path: response.secure_url,
      });
      //   console.log('chegou aqui');
      // if (group_id) {
      //   const newFile = await Group.update(
      //     {
      //       group_avatar_id: newFile.id,
      //     },
      //     {
      //       where: { id: group_id },
      //     }
      //   );

      //   return res.status(201).json(newFile);
      // } else {

      await User.update(
        {
          user_avatar_id: newFile.id,
        },
        {
          where: { id: req.userId },
          returning: true,
          plain: true,
        }
      );

      return res.status(201).send(newFile);
    } catch (err) {
      return res.status(400).send(err);
    }
  }

  async delete(req, res) {}
}
export default new SessionController();
