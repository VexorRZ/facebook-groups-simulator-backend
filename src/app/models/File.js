import { Model, Sequelize } from 'sequelize';
import 'dotenv/config';

class File extends Model {
  static init(sequelize) {
    super.init(
      {
        public_id: Sequelize.STRING,
        name: Sequelize.STRING,
        path: Sequelize.STRING,
        url: {
          type: Sequelize.VIRTUAL,
          get() {
            return `${process.env.APP_URL}/files/${this.path}`;
          },
        },
      },
      {
        sequelize,
        tableName: 'files',
      }
    );

    return this;
  }

  static associate(models) {
    this.hasOne(models.Group, {
      foreignKey: 'id',
      through: 'groups',
      as: 'group_avatar',
    });

    this.hasOne(models.User, {
      foreignKey: 'id',
      through: 'users',
      as: 'user_avatar',
    });
  }
}

export default File;
