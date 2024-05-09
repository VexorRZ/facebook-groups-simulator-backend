import { Model, Sequelize } from 'sequelize';

class CommentLikes extends Model {
  static init(sequelize) {
    super.init(
      {
        author_id: Sequelize.INTEGER,
        comment_id: Sequelize.INTEGER,
      },
      {
        sequelize,
        tableName: 'comments_likes',
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Comment, { foreignKey: 'comment_id', as: 'comment' });
    this.belongsTo(models.User, { foreignKey: 'author_id', as: 'author' });
  }
}

export default CommentLikes;
