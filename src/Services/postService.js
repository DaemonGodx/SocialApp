import PostRepo from "../repository/postRepo.js";
const postRepo = new PostRepo();

class PostService {
  async create({ content, user,image }) {
    try {
      return await postRepo.create({ content, user,image });
    } catch (err) {
      console.log("Service Layer Error (createPost):", err);
      throw err;
    }
  }

  async getAll({ page, limit }) {
    try {
      return await postRepo.getAll({ page, limit });
    } catch (err) {
      console.log("Service Layer Error (getAllPosts):", err);
      throw err;
    }
  }

  async getByUser({ userId,currentUserId, page, limit,cursor }) {
    try {
      return await postRepo.getByUser({ userId,currentUserId, page, limit,cursor });
    } catch (err) {
      console.log("Service Layer Error (getByUser):", err);
      throw err;
    }
  }

  async getById({ postId, currentUserId}) {
    try {
      return await postRepo.getById({ postId,currentUserId });
    } catch (err) {
      console.log("Service Layer Error (getById):", err);
      throw err;
    }
  }

  async update({ postId, userId, content }) {
    try {
      return await postRepo.update({ postId, userId, content });
    } catch (err) {
      console.log("Service Layer Error (updatePost):", err);
      throw err;
    }
  }

  async delete({ postId, userId }) {
    try {
      return await postRepo.delete({ postId, userId });
    } catch (err) {
      console.log("Service Layer Error (deletePost):", err);
      throw err;
    }
  }
}

export default PostService;
