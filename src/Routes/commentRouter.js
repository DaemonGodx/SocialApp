import express from "express";
import { checkAuth } from "../middlewares/auth.js";
import {
  createComment,
  getCommentsByPost,
  deleteComment,
  getReplies,
} from "../controllers/commentController.js";

const commentRouter = express.Router();

// create comment OR reply (parentCommentId in body)
commentRouter.post("/:postId", checkAuth, createComment);

// get top comments OR replies (parentCommentId in query)
commentRouter.get("/:postId", checkAuth, getCommentsByPost);
//getReplies
commentRouter.get("/:commentId/replies", checkAuth, getReplies);


// soft delete
commentRouter.delete("/:commentId", checkAuth, deleteComment);

export default commentRouter;
