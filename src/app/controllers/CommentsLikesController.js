import Like from '../models/CommentsLikes';
import User from '../models/User';

class SessionController {
  async store(req, res) {
    try {
      const { author_id, comment_id } = req.params;

      const likeExists = await Like.find({
        where: { author_id: author_id, comment_id: comment_id },
      });

      if (likeExists) {
        return res.status(400).json({ msg: 'you already liked this comment' });
      }

      const createLike = await Like.create({
        id,
        author_id,
        comment_id,
      });

      return res.status(201).json(createLike);
    } catch (err) {
      return err;
    }
  }

  async delete(req, res) {}
}
export default new SessionController();
