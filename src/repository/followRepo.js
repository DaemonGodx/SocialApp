import Follow from "../models/followSchema.js";

class FollowRepo {
  async findFollow({ followerId, followingId }, session = null) {
    const query = Follow.findOne({ followerId, followingId });
    if (session) query.session(session);
    return query;
  }

  async createFollow({ followerId, followingId }, session = null) {
    const docs = await Follow.create(
      [{ followerId, followingId }],
      session ? { session } : {}
    );
    return docs[0];
  }

  async deleteById({ followId }, session = null) {
    const query = Follow.findByIdAndDelete(followId);
    if (session) query.session(session);
    return query;
  }

  async isFollowing({ followerId, followingId }) {
    try {
      return await Follow.exists({ followerId, followingId });
    } catch (err) {
      throw err;
    }
  }

  async getFollowers({ userId, page = 1, limit = 20 }) {
    try {
      const safePage = Math.max(parseInt(page) || 1, 1);
      const safeLimit = Math.min(Math.max(parseInt(limit) || 20, 1), 50);
      const skip = (safePage - 1) * safeLimit;

      return await Follow.find({ followingId: userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(safeLimit)
        .populate("followerId", "username name profilePicUrl");
    } catch (err) {
      throw err;
    }
  }

  async getFollowing({ userId, page = 1, limit = 20 }) {
    try {
      const safePage = Math.max(parseInt(page) || 1, 1);
      const safeLimit = Math.min(Math.max(parseInt(limit) || 20, 1), 50);
      const skip = (safePage - 1) * safeLimit;

      return await Follow.find({ followerId: userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(safeLimit)
        .populate("followingId", "username name profilePicUrl");
    } catch (err) {
      throw err;
    }
  }

}


export default FollowRepo;