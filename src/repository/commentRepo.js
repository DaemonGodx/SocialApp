import Comment from "../models/commentsSchema.js";

class CommentRepo {
  async createComment({ postId, userId, content, parentCommentId = null }, session = null) {
    try {
      const docs = await Comment.create(
        [{ postId, userId, content, parentCommentId }],
        session ? { session } : {}
      );
      return docs[0];
    } catch (err) {
      throw err;
    }
  }

  async getCommentsByPost({ postId, parentCommentId = null, page = 1, limit = 20 }) {
    try {
      const safePage = Math.max(parseInt(page) || 1, 1);
      const safeLimit = Math.min(Math.max(parseInt(limit) || 20, 1), 50);
      const skip = (safePage - 1) * safeLimit;

      return await Comment.find({
        postId,
        parentCommentId,
        isDeleted: false,
      })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(safeLimit)
        .populate("userId", "username name avatar");
    } catch (err) {
      throw err;
    }
  }

  async findCommentById({ commentId }, session = null) {
    try {
      const query = Comment.findById(commentId);
      if (session) query.session(session);
      return await query;
    } catch (err) {
      throw err;
    }
  }

  async softDeleteComment({ commentId }, session = null) {
    try {
      const query = Comment.findOneAndUpdate(
        { _id: commentId, isDeleted: false },
        { $set: { isDeleted: true, deletedAt: new Date() } },
        { new: true }
      );

      if (session) query.session(session);
      return await query;
    } catch (err) {
      throw err;
    }
  }
  async getReplies({ commentId, page = 1, limit = 20 }) {
  const safePage = Math.max(parseInt(page) || 1, 1);
  const safeLimit = Math.min(Math.max(parseInt(limit) || 20, 1), 50);
  const skip = (safePage - 1) * safeLimit;

  return await Comment.find({
    parentCommentId: commentId,
    isDeleted: false,
  })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(safeLimit)
    .populate("userId", "username name profilePicUrl");
}

}

export default CommentRepo;
