import File from '../models/File';
import User from '../models/User';
import { v2 as cloudinary } from 'cloudinary';
import CloudiNaryConfig from '../../config/cloudinaryConfig';
import { v4 as uuidv4 } from 'uuid';
require('dotenv').config();

CloudiNaryConfig;

class SessionController {
  async store(req, res) {
    try {
      const { path } = req.file;

      const response = await cloudinary.uploader.upload(path, {
        folder: process.env.IMAGES_FOLDER,
      });

      const newFile = await File.create({
        id: uuidv4(),
        name: response.original_filename,
        path: response.secure_url,
      });
      console.log(newFile);

      await User.update(
        {
          user_avatar_id: newFile.id,
        },
        { where: { id: req.userId } }
      );
    } catch (err) {
      return err;
    }
  }

  async delete(req, res) {}
}
export default new SessionController();
