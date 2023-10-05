module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.addColumn('groups', 'avatar', {
            type: Sequelize.STRING,
        });
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.removeColumn('groups', 'avatar', {
            type: Sequelize.STRING,
        });
    },
};
