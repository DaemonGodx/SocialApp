import express from "express"
import { checkAuth } from "../middlewares/auth.js"
import {getFeed} from "./feedController.js"
const feedRouter=express.Router()
feedRouter.get("/",checkAuth,getFeed)

export default feedRouter