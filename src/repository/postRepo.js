import Post from "../models/postSchema.js";

class PostRepo {
  async create({ content, user, image}) {
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

  async getByUser({ userId, page = 1, limit = 10 }) {
    try {
      page = Math.max(parseInt(page), 1);
      limit = Math.min(Math.max(parseInt(limit), 1), 50);
      const skip = (page - 1) * limit;

      const posts = await Post.find({ user: userId, isDeleted: false })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

      return posts;
    } catch (err) {
      console.log("Repository Layer Error (getByUser):", err);
      throw err;
    }
  }

  async getById({ postId }) {
    try {
      const post = await Post.findOne({ _id: postId, isDeleted: false })
        .populate("user", "name username profilePicUrl")
        .lean();

      return post;
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
