
import express from "express"
import userRouter from "./userRouter.js";
import postRouter from "./postRoute.js";
import followRouter from "./FollowRouter.js";
import likeRouter from "./likeRouter.js";
import commentRouter from "./commentRouter.js";

const route=express.Router();
import listEndpoints from "express-list-endpoints";


route.use("/user",userRouter)
route.use("/post",postRouter)
route.use("/follow",followRouter)
route.use("/like",likeRouter)
route.use("/comment",commentRouter)
console.log(listEndpoints(route));
export default route
