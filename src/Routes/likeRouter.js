import express from "express";
import { checkAuth } from "../middlewares/auth.js";
import { toggleLike, getLikesByPost } from "../controllers/likeController.js";

const likeRouter = express.Router();

likeRouter.post("/:postId/toggle", checkAuth, toggleLike);
likeRouter.get("/:postId", checkAuth, getLikesByPost);

export default likeRouter;
