module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('groups_members', {
      id: {
        type: Sequelize.INTEGER,
        // type: Sequelize.STRING,
        // defaultValue: Sequelize.STRING(),
        allowNull: false,
        unique: true,
        primaryKey: true,
        autoIncrement: true,
      },

      member_id: {
        type: Sequelize.INTEGER,
        // defaultValue: Sequelize.STRING(),
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      group_id: {
        type: Sequelize.INTEGER,
        // defaultValue: Sequelize.STRING(),
        allowNull: false,
        references: { model: 'groups', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },

      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  down: (queryInterface) => {
    return queryInterface.dropTable('groups_members');
  },
};
