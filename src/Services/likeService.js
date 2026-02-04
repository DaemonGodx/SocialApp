import mongoose from "mongoose";
import LikeRepo from "../repository/likeRepo.js";
import Post from "../models/postSchema.js";

const likeRepo = new LikeRepo();

class LikeService {
  async toggleLike({ userId, postId }) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const postExists = await Post.exists({ _id: postId }).session(session);
      if (!postExists) {
        throw new Error("Post not found");
      }

      const existing = await likeRepo.findLike({ userId, postId }, session);

      // UNLIKE
      if (existing) {
        await likeRepo.deleteById({ likeId: existing._id }, session);

        
        await Post.updateOne({ _id: postId, likesCount: { $gt: 0 } }, { $inc: { likesCount: -1 } }, { session });

        await session.commitTransaction();
        return false; // isLiked = false
      }

      // LIKE
      await likeRepo.createLike({ userId, postId }, session);

      
      await Post.updateOne({ _id: postId }, { $inc: { likesCount: 1 } }, { session });

      await session.commitTransaction();
      return true; // isLiked = true
    } catch (err) {
      await session.abortTransaction();
      throw err;
    } finally {
      session.endSession();
    }
  }

  async getLikesByPost({ postId, page, limit }) {
    try{
           return likeRepo.getLikesByPost({ postId, page, limit });

    }
    catch(err)
    {
        throw err;
    }
 
  }
async processLikeEvent({ userId, postId, action }) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // 1️⃣ Ensure post exists (safety check)
      const postExists = await Post.exists({ _id: postId }).session(session);
      if (!postExists) {
        throw new Error("Post not found");
      }

      // 2️⃣ Check if like already exists
      const existing = await likeRepo.findLike(
        { userId, postId },
        session
      );

      // ========== UNLIKE PATH ==========
      if (action === "UNLIKE") {
        if (existing) {
          await likeRepo.deleteById(
            { likeId: existing._id },
            session
          );

          await Post.updateOne(
            { _id: postId, likesCount: { $gt: 0 } },
            { $inc: { likesCount: -1 } },
            { session }
          );
        }
      }

      // ========== LIKE PATH ==========
      if (action === "LIKE") {
        if (!existing) {
          await likeRepo.createLike(
            { userId, postId },
            session
          );

          await Post.updateOne(
            { _id: postId },
            { $inc: { likesCount: 1 } },
            { session }
          );
        }
      }

      await session.commitTransaction();
      return true;

    } catch (err) {
      await session.abortTransaction();
      throw err;
    } finally {
      session.endSession();
    }
  }
}

export default LikeService;
