import { Model, Sequelize } from 'sequelize';

class GroupMembers extends Model {
  static init(sequelize) {
    super.init(
      {
        member_id: Sequelize.INTEGER,
        group_id: Sequelize.INTEGER,
      },
      {
        sequelize,
        tableName: 'groups_members',
      }
    );

    return this;
  }

  static associate(models) {
    this.hasMany(models.User, { foreignKey: 'id', as: 'members' });

    this.hasMany(models.Group, { foreignKey: 'id', as: 'groups' });
  }
}

export default GroupMembers;
