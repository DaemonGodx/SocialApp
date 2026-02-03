
import express from "express"
import userRouter from "./userRouter.js";
import postRouter from "./postRoute.js";
import followRouter from "./FollowRouter.js";
import likeRouter from "./likeRouter.js";
import commentRouter from "./commentRouter.js";
import feedRouter from "../feed/feedRouter.js";

const route=express.Router();



route.use("/user",userRouter)
route.use("/post",postRouter)
route.use("/follow",followRouter)
route.use("/like",likeRouter)
route.use("/comment",commentRouter)
route.use("/feed",feedRouter)

export default route
