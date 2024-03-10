module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('users', 'user_avatar_id', {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      references: { model: 'files', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
      allowNull: true,
    });
  },

  down: (queryInterface) => {
    return queryInterface.removeColumn('users', 'user_avatar_id');
  },
};
