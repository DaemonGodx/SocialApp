import Post from "../models/postSchema.js";
import mongoose from "mongoose";
import { buildPostAggregation } from "../aggrigations/postAggregator.js";


class PostRepo {
  async create({ content, user, image }) {
    try {
      const post = await Post.create({
        content,
        user,
        likesCount: 0,
        commentsCount: 0,
        image,
      });

      return post;
    } catch (err) {
      console.log("Repository Layer Error (createPost):", err);
      throw err;
    }
  }

  async getAll({ page = 1, limit = 10 }) {
    try {
      page = Math.max(parseInt(page), 1);
      limit = Math.min(Math.max(parseInt(limit), 1), 50);
      const skip = (page - 1) * limit;

      const posts = await Post.find({ isDeleted: false })
        .populate("user", "name username profilePicUrl")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

      return posts;
    } catch (err) {
      console.log("Repository Layer Error (getAllPosts):", err);
      throw err;
    }
  }

  async getByUser({
    userId,
    currentUserId,
    page,
    limit = 10,
    cursor
  }) {
    try {
      limit = Math.min(Math.max(parseInt(limit), 1), 50);

      const match = {
        user: new mongoose.Types.ObjectId(userId)
      };

      // 🔥 Cursor filter (ONLY createdAt – profile is single-user)
      if (cursor) {
        match.createdAt = { $lt: new Date(cursor) };
      }

      const pipeline = buildPostAggregation({
        match,
        currentUserId
      });

      let posts = [];
      let hasMore = false;
      let nextCursor = null;

      // CURSOR PAGINATION
      if (cursor || !page) {
        pipeline.push({ $limit: limit + 1 });

        const result = await Post.aggregate(pipeline);

        hasMore = result.length > limit;
        posts = hasMore ? result.slice(0, limit) : result;

        nextCursor = hasMore
          ? posts[posts.length - 1].createdAt
          : null;
      }

      //  NORMAL PAGE PAGINATION

      else {
        page = Math.max(parseInt(page), 1);
        const skip = (page - 1) * limit;

        pipeline.push(
          { $skip: skip },
          { $limit: limit }
        );

        posts = await Post.aggregate(pipeline);

        // lightweight hasMore (no total count)
        hasMore = posts.length === limit;
      }

      return {

        hasMore,
        nextCursor,
        page: page || null,
        posts
      };

    } catch (err) {
      console.log("Repository Layer Error (getByUser):", err);
      throw err;
    }
  }


  async getById({ postId, currentUserId }) {
    try {
      const pipeline = buildPostAggregation({
        match: {
          _id: new mongoose.Types.ObjectId(postId)
        },
        currentUserId
      });

      const result = await Post.aggregate(pipeline);

      // aggregation always returns array
      return result[0] || null;

    } catch (err) {
      console.log("Repository Layer Error (getById):", err);
      throw err;
    }
  }


  async update({ postId, userId, content, media }) {
    try {
      const updated = await Post.findOneAndUpdate(
        { _id: postId, user: userId, isDeleted: false },
        {
          ...(content !== undefined ? { content } : {}),
          ...(media !== undefined ? { media } : {}),
        },
        { new: true }
      );

      return updated;
    } catch (err) {
      console.log("Repository Layer Error (updatePost):", err);
      throw err;
    }
  }

  async delete({ postId, userId }) {
    try {
      const deleted = await Post.findOneAndUpdate(
        { _id: postId, user: userId, isDeleted: false },
        { isDeleted: true },
        { new: true }
      );

      return deleted;
    } catch (err) {
      console.log("Repository Layer Error (deletePost):", err);
      throw err;
    }
  }
}

export default PostRepo;
