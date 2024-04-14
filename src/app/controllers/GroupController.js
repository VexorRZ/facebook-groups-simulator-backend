import * as Yup from 'yup';
import Group from '../models/Group';
import File from '../models/File';
import User from '../models/User';
import { v2 as cloudinary } from 'cloudinary';
import { v4 as uuidv4 } from 'uuid';
import CloudiNaryConfig from '../../config/cloudinaryConfig';
require('dotenv').config();

CloudiNaryConfig;

class GroupController {
  async create(req, res, next) {
    try {
      const { id, name, is_private, description } = req.body;
      const { path } = req.file;
      const schema = Yup.object().shape({
        name: Yup.string().required(),
        is_private: Yup.boolean().required(),
        description: Yup.string(),
      });

      if (!(await schema.isValid(req.body)))
        return res.status(400).json({ error: 'validation fails' });

      const groupExists = await Group.findOne({
        where: { name },
      });
      if (groupExists)
        return res.status(400).json({ error: 'group already exists' });

      const response = await cloudinary.uploader.upload(path, {
        folder: process.env.IMAGES_FOLDER,
      });

      const newFile = await File.create({
        id: uuidv4(),
        public_id: response.public_id,
        name: response.original_filename,
        path: response.secure_url,
      });

      const groupCreated = await Group.create({
        id,
        name,
        description,
        is_private,
        owner_id: req.userId,
        group_avatar_id: newFile.id,
      });

      const user = await User.findByPk(req.userId);

      await user.addGroup(groupCreated);

      return res.json({
        image: response,
        id: groupCreated.id,
        name,
        description,
        is_private,
        owner: groupCreated.owner_id,
        avatar: response.url,
      });
    } catch (err) {
      console.log(err);
      return res.status(400).send(err);
    }
  }

  async index(req, res) {
    const { page, size } = req.query;
    const groups = await Group.findAll({
      limit: size,
      offset: Number(page * size) - Number(size),
      attributes: ['id', 'name', 'is_private', 'group_avatar_id'],
      order: ['id'],
      include: [
        {
          association: 'administrator',
          attributes: ['id', 'name'],
        },
        {
          association: 'moderators',
          attributes: ['id', 'name'],
        },
        {
          association: 'avatar',
          attributes: ['id', 'path'],
        },

        {
          association: 'requesters',
          attributes: ['id'],
        },
        {
          association: 'bans',
          attributes: ['id'],
        },
        {
          association: 'topics',
          attributes: ['name', 'id'],
          include: {
            association: 'author',
            attributes: ['name', 'id'],
          },
          include: {
            association: 'comments',
            attributes: ['body'],
            include: {
              association: 'author',
              attributes: ['name', 'id'],
            },
          },
        },
        {
          association: 'members',
          attributes: ['id', 'name'],
        },
      ],
    });

    if (!groups) return res.status(400).json({ error: 'no groups was found' });

    return res.status(200).json(groups);
  }

  async show(req, res) {
    const { group_id } = req.params;

    try {
      const groupExists = await Group.findByPk(group_id);

      if (!groupExists) return res.status(400).json('group do not exists');

      const isMember = await Group.findOne({
        where: { id: group_id },
        include: {
          association: 'members',
          where: { id: req.userId },
          required: true,
        },
      });

      const isOwner = await Group.findOne({
        where: { id: group_id, owner_id: req.userId },
        attributes: ['id'],
      });

      const includeStatement = [];

      if (!isMember && groupExists.is_private) {
        includeStatement.push(
          {
            association: 'administrator',
            attributes: ['id', 'name'],
          },
          {
            association: 'moderators',
            attributes: ['id', 'name'],
          }
        );
      } else {
        const { page, size } = req.query;

        includeStatement.push(
          {
            association: 'topics',
            attributes: ['id', 'name', 'author_id'],

            order: [['createdAt', 'DESC']],
            limit: size,
            offset: Number(page * size) - Number(size),

            include: [
              {
                association: 'author',
                attributes: ['id', 'name'],
              },

              {
                association: 'comments',
                attributes: ['id', 'author_id', 'body'],
              },
            ],
          },

          // {
          //   association: 'members',
          //   attributes: ['id', 'member_id'],
          //   //where: { id: group_id },
          // },
          {
            association: 'avatar',
            attributes: ['id', 'path'],
          },

          {
            association: 'administrator',
            attributes: ['id', 'name'],
          },
          {
            association: 'moderators',
            attributes: ['id', 'name'],
          },
          // {
          //   association: 'members',
          //   attributes: ['id', 'name'],
          //   order: ['createdAt'],
          //   // limit: size,
          //   // offset: Number(page * size) - Number(size),
          //   include: {
          //     association: 'avatar',
          //     attributes: ['path'],
          //   },
          // },
          {
            association: 'requesters',
            attributes: ['id'],
          },
          {
            association: 'bans',
            attributes: ['id'],
          }
        );
      }

      const group = await Group.findByPk(group_id, {
        attributes: ['id', 'name', 'is_private', 'group_avatar_id'],
        include: includeStatement,

        // include: [
        //   {
        //     association: 'members',
        //     attributes: ['id', 'name'],
        //   },
        //   {
        //     association: 'topics',
        //     attributes: ['id', 'name', 'author_id'],
        //     order: ['createdAt'],
        //     limit: size,
        //     offset: Number(page * size) - Number(size),

        //     include: {
        //       association: 'comments',
        //       attributes: ['id', 'author_id', 'body'],
        //     },
        //   },
        // ],
      });

      const numberOfTopicsCount = await Group.findByPk(group_id, {
        attributes: ['id', 'name', 'is_private'],
        include: [
          {
            association: 'topics',
            attributes: ['id', 'name', 'author_id'],
          },
          {
            association: 'members',
            attributes: ['id', 'name'],
          },
        ],
      });

      const numberOfTopics = numberOfTopicsCount.topics.length;
      const numberOfMembers = numberOfTopicsCount.members.length;

      return res.json({ group, numberOfTopics, isOwner, numberOfMembers });
    } catch (err) {
      console.log(err);
    }
  }

  async update(req, res) {
    const { group_id } = req.params;
    const { name, is_private } = req.body;

    const schema = Yup.object().shape({
      name: Yup.string(),
      is_private: Yup.boolean(),
    });

    if (!(await schema.isValid(req.body)))
      return res.status(400).json({ error: 'validation fails' });

    const groupExists = await Group.findByPk(group_id);
    if (!groupExists)
      return res.status(400).json({ error: 'group do not exists' });

    const isOwner = await Group.findOne({
      where: { id: group_id, owner_id: req.userId },
    });

    const isModerator = await Group.findOne({
      where: { id: group_id },
      include: [
        {
          association: 'moderators',
          where: { id: req.userId },
        },
      ],
    });

    if (!isOwner && !isModerator)
      return res
        .status(401)
        .json({ error: 'Only the admin or moderators can update the group' });

    await Group.update(
      {
        name,
        is_private,
      },
      { where: { id: group_id } }
    );

    return res.status(200).json({
      message: 'group successfully updated',
      name,
      is_private,
    });
  }

  async delete(req, res) {
    const { group_id } = req.params;

    const groupExists = await Group.findByPk(group_id);
    if (!groupExists) return res.status(400).json('Group do not exists');

    const isOwner = await Group.findOne({
      where: { id: group_id, owner_id: req.userId },
    });

    if (!isOwner)
      return res.status(401).json({
        error: 'Only the owner can delete the group',
      });

    await Group.destroy({ where: { id: group_id } });

    return res.status(200).json({ msg: 'group successfully deleted' });
  }
}

export default new GroupController();
