import express from "express";
import { checkAuth } from "../middlewares/auth.js";
import {
  toggleFollow,
  getFollowers,
  getFollowing,
  isFollowing,
} from "../controllers/FollowController.js";

const followRouter = express.Router();

// follow / unfollow
followRouter.post("/:userId/toggle", checkAuth, toggleFollow); 

// lists
followRouter.get("/:userId/followers", checkAuth, getFollowers);
followRouter.get("/:userId/following", checkAuth, getFollowing);
//isfollow
followRouter.get("/:userId/isfollowing", checkAuth, isFollowing);

export default followRouter;
