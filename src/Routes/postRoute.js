import express from "express";
import {checkAuth} from "../middlewares/auth.js";
import { upload } from "../middlewares/multer.js";
import {
  createPost,
  getAllPosts,
  getPostsByUser,
  getPostById,
  updatePost,
  deletePost,
} from "../controllers/postController.js";

const postRouter = express.Router();

postRouter.post("/", checkAuth, upload.single("image"), createPost);
postRouter.get("/", checkAuth, getAllPosts);
postRouter.get("/:userId/posts", checkAuth, getPostsByUser);
postRouter.get("/:id", checkAuth, getPostById);
postRouter.patch("/:id", checkAuth, updatePost);
postRouter.delete("/:id", checkAuth, deletePost);



export default postRouter;
