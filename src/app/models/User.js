import { Model, Sequelize } from 'sequelize';

import bcrypt from 'bcryptjs';
import { STRING } from 'sequelize';

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        surname: Sequelize.STRING,
        permitted_to_add_in_groups: Sequelize.BOOLEAN,
        user_avatar_id: Sequelize.STRING,
        password: Sequelize.VIRTUAL,
        password_hash: Sequelize.STRING,
        password_reset_token: {
          type: Sequelize.STRING,
          select: false,
        },
        password_reset_expires: {
          type: Sequelize.DATE,
          select: false,
        },
      },
      {
        sequelize,
        tableName: 'users',
      }
    );
    this.addHook('beforeSave', async (user) => {
      if (user.password) {
        user.password_hash = await bcrypt.hash(user.password, 8);
      }
    });

    return this;
  }

  static associate(models) {
    this.hasMany(models.Group, {
      foreignKey: 'owner_id',
      as: 'administrator',
    });

    this.belongsToMany(models.Group, {
      foreignKey: 'requester_id',
      through: 'request_entrys',
      as: 'requester',
    });

    this.belongsToMany(models.Group, {
      foreignKey: 'member_id',
      through: 'groups_members',
      as: 'groups',
    });

    this.belongsToMany(models.Group, {
      foreignKey: 'moderator_id',
      through: 'groups_moderators',
      as: 'moderator',
    });

    this.belongsToMany(models.Group, {
      foreignKey: 'banned_id',
      through: 'groups_bans',
      as: 'banned_of_groups',
    });

    this.hasMany(models.Topic, {
      foreignKey: 'author_id',
      as: 'topics_created',
    });

    this.hasMany(models.Comment, {
      foreignKey: 'author_id',
      as: 'comments_created',
    });

    this.belongsTo(models.File, {
      foreignKey: 'user_avatar_id',
      through: 'files',
      as: 'avatar',
    });
  }

  checkPassword(password) {
    return bcrypt.compare(password, this.password_hash);
  }
}

export default User;
