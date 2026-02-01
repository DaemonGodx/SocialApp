import mongoose from "mongoose";
import CommentRepo from "../repository/commentRepo.js";
import Post from "../models/postSchema.js";
import Comment from "../models/commentsSchema.js";

const commentRepo = new CommentRepo();

class CommentService {
  async createComment({ postId, userId, content, parentCommentId = null }) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      if (!content || !content.trim()) {
        throw new Error("Comment content is required");
      }

      const postExists = await Post.exists({ _id: postId }).session(session);
      if (!postExists) {
        throw new Error("Post not found");
      }

      if (parentCommentId) {
        const parentExists = await Comment.exists({
          _id: parentCommentId,
          postId,
          isDeleted: false,
        }).session(session);

        if (!parentExists) {
          throw new Error("Parent comment not found");
        }
      }

      const comment = await commentRepo.createComment(
        {
          postId,
          userId,
          content: content.trim(),
          parentCommentId: parentCommentId || null,
        },
        session
      );

      await Post.updateOne(
        { _id: postId },
        { $inc: { commentsCount: 1 } },
        { session }
      );

      await session.commitTransaction();
      return comment;
    } catch (err) {
      await session.abortTransaction();
      throw err;
    } finally {
      session.endSession();
    }
  }

  async getCommentsByPost({ postId, parentCommentId = null, page, limit }) {
    return commentRepo.getCommentsByPost({ postId, parentCommentId, page, limit });
  }

  async deleteComment({ commentId, userId }) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const comment = await commentRepo.findCommentById({ commentId }, session);

      if (!comment) {
        throw new Error("Comment not found");
      }

      if (comment.isDeleted) {
        throw new Error("Comment already deleted");
      }

      if (comment.userId.toString() !== userId.toString()) {
        throw new Error("Not allowed");
      }

      const deleted = await commentRepo.softDeleteComment({ commentId }, session);

      await Post.updateOne(
        { _id: comment.postId, commentsCount: { $gt: 0 } },
        { $inc: { commentsCount: -1 } },
        { session }
      );

      await session.commitTransaction();
      return deleted;
    } catch (err) {
      await session.abortTransaction();
      throw err;
    } finally {
      session.endSession();
    }
  }
  async getReplies({ commentId, page, limit }) {
  return commentRepo.getReplies({ commentId, page, limit });
}

}

export default CommentService;
