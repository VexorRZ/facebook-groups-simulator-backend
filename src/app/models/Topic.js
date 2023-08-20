import { Model, Sequelize } from 'sequelize';

class Topic extends Model {
    static init(sequelize) {
        super.init({
            topic_title: Sequelize.STRING,
            is_closed: Sequelize.BOOLEAN,
        }, {
            sequelize,
            tableName: 'topics',
        });

        return this;
    }

    static associate(models) {
        this.belongsTo(models.User, { foreignKey: 'author_id', as: 'author' });

        this.belongsTo(models.Group, { foreignKey: 'group_id', as: 'group' });

        this.hasMany(models.Comment, { foreignKey: 'author_id', as: 'comments' });
    }
}

export default Topic;