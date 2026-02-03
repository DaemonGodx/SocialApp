import express from "express"
import {create,login,getCurrentuser,update,getProfileDetails} from "../controllers/userController.js"
import {validateRegister,validateLogin,validateUpdateUser} from "../middlewares/validate.js"
import { checkAuth } from "../middlewares/auth.js"
import { upload } from "../middlewares/multer.js"


const userRouter=express.Router()
userRouter.post("/register",upload.single("profilePic"),validateRegister,create)
userRouter.patch("/update",checkAuth,upload.single("profilePic"),validateUpdateUser,update)
userRouter.post("/login",validateLogin,login)
userRouter.get("/me",checkAuth,getCurrentuser)
userRouter.get("/:id/profile",checkAuth,getProfileDetails)

export default userRouter