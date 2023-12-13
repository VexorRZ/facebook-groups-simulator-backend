import { Model, Sequelize } from 'sequelize';
import 'dotenv/config';

class File extends Model {
  static init(sequelize) {
    super.init(
      {
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
    this.belongsTo(models.Group, {
      foreignKey: 'id',
      through: 'groups',
      as: 'group_avatar',
    });
  }
}

export default File;
