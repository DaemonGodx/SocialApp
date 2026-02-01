import Like from "../models/likeSchema.js";

class LikeRepo {
  async findLike({ userId, postId }, session = null) {
    try {
      const query = Like.findOne({ userId, postId });
      if (session) query.session(session);
      return await query;
    } catch (err) {
      throw err;
    }
  }

  async createLike({ userId, postId }, session = null) {
    try {
      const docs = await Like.create(
        [{ userId, postId }],
        session ? { session } : {}
      );
      return docs[0];
    } catch (err) {
      throw err;
    }
  }

  async deleteById({ likeId }, session = null) {
    try {
      const query = Like.findByIdAndDelete(likeId);
      if (session) query.session(session);
      return await query;
    } catch (err) {
      throw err;
    }
  }

  async getLikesByPost({ postId, page = 1, limit = 20 }) {
    try {
      const safePage = Math.max(parseInt(page) || 1, 1);
      const safeLimit = Math.min(Math.max(parseInt(limit) || 20, 1), 50);
      const skip = (safePage - 1) * safeLimit;

      return await Like.find({ postId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(safeLimit)
        .populate("userId", "username name profilePicUrl");
    } catch (err) {
      throw err;
    }
  }
}

export default LikeRepo;
