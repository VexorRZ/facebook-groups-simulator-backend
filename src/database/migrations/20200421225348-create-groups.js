module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('groups', {
      id: {
        type: Sequelize.INTEGER,
        //  defaultValue: Sequelize.STRING(),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      is_private: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },

      group_avatar_id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        references: { model: 'files', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        allowNull: true,
      },

      owner_id: {
        type: Sequelize.INTEGER,
        // type: Sequelize.UUID,
        // defaultValue: Sequelize.UUIDV4(),
        allowNull: false,
        references: { model: 'users', key: 'id' },
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
    return queryInterface.dropTable('groups');
  },
};
