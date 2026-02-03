import PostService from "../Services/postService.js";
import { uploadToCloudinary } from "../utils/CloudinaryUpload.js";
import cloudinary from "../config/cloudinary.js";


const postService = new PostService();
let uploadedImage=null

export const createPost = async (req, res) => {
  try {
     const userId = req.user.user._id;

    if (!req.body.content) {
      return res.status(400).json({
        success: false,
        message: "Post content is required",
      });
    }

    let postData = {
      content: req.body.content,
      user: userId,
    };

    if (req.file) {
      const result = await uploadToCloudinary(
        req.file.buffer,
        "socialhub/posts"
      );

      postData.image = {
        url: result.secure_url,
        publicId: result.public_id,
      };
      uploadedImage=postData.image
    }

    const post = await postService.create(postData);
    return res.status(201).json({
      success: true,
      message: "Post created successfully",
      post,
    });
  } catch (err) {
    console.log("Controller Error (createPost):", err);
     if (uploadedImage?.publicId) {
      try {
        await cloudinary.uploader.destroy(uploadedImage.publicId);
        console.log("Rolled back image upload");
      } catch (cleanupErr) {
        console.error("Rollback failed:", cleanupErr.message);
      }
    }
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const { page, limit } = req.query;

    const posts = await postService.getAll({ page, limit });

    return res.status(200).json({
      success: true,
      message: "Posts fetched successfully",
      count: posts.length,
      posts,
    });
  } catch (err) {
    console.log("Controller Error (getAllPosts):", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getPostsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page, limit,cursor } = req.query;
    const currentUserId = req.user.user._id;
    const posts = await postService.getByUser({ userId,currentUserId, page, limit,cursor });

    return res.status(200).json({
      success: true,
      message: "User posts fetched successfully",
      count: posts.length,
      posts,
    });
  } catch (err) {
    console.log("Controller Error (getPostsByUser):", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getPostById = async (req, res) => {
  try {
    const { id } = req.params;
    const currentUserId = req.user.user._id;


    const post = await postService.getById({ postId: id,currentUserId });

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Post fetched successfully",
      post,
    });
  } catch (err) {
    console.log("Controller Error (getPostById):", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    const updated = await postService.update({
      postId: id,
      userId: req.user.user._id,
      content,
    });

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Post not found or not allowed",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Post updated successfully",
      post: updated,
    });
  } catch (err) {
    console.log("Controller Error (updatePost):", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await postService.delete({
      postId: id,
      userId: req.user.user._id,
    });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Post not found or not allowed",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Post deleted successfully",
    });
  } catch (err) {
    console.log("Controller Error (deletePost):", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
