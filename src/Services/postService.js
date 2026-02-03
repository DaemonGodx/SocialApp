import PostRepo from "../repository/postRepo.js";
import { invalidateFeedForUserAndFollowers } from "../utils/ivalidateCach.js";



const postRepo = new PostRepo();

class PostService {
  async create({ content, user,image }) {
    try {
      const post= await postRepo.create({ content, user,image });
      await invalidateFeedForUserAndFollowers(post.user._id);
      return post;
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
      const post =await postRepo.delete({ postId, userId });
      await invalidateFeedForUserAndFollowers(userId);
      return post;
    } catch (err) {
      console.log("Service Layer Error (deletePost):", err);
      throw err;
    }
  }
}



export default PostService;
