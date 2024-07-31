import Like from '../models/CommentsLikes';
// import pusher from 'pusher';
// require('dotenv').config();

// let pusher = new Pusher({
//   appId: process.env.PUSHER_APP_ID,
//   key: process.env.PUSHER_APP_KEY,
//   secret: process.env.PUSHER_APP_SECRET,
//   cluster: process.env.PUSHER_APP_CLUSTER,
// });

class CommentLikesController {
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

  async createOrUpdate(req, res) {
    try {
      console.log('chegou aqui');
      const { author_id, comment_id } = req.params;

      const likeExists = await Like.findOne({
        where: { author_id: author_id, comment_id: comment_id },
      });
      console.log('chegou aqui no controller de commentários');
      if (!likeExists) {
        const createLike = await Like.create({
          author_id: author_id,
          comment_id: comment_id,
        });

        // pusher.trigger(
        //   'comment-events',
        //   'likeAction',
        //   { action: 'Like', comment_id: comment_id },
        //   req.body.socketId
        // );

        return res.status(201).json(createLike);
      } else {
        await Like.destroy({
          where: { author_id: author_id, comment_id: comment_id },
        });
        return res.status(201).json();
      }
    } catch (err) {
      console.log(err);
      return res.status(400).json({ error: err });
    }
  }
}
export default new CommentLikesController();
