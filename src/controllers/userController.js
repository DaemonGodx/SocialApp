import userService from "../Services/userService.js"
const UserService = new userService();
import { uploadToCloudinary } from "../utils/CloudinaryUpload.js"
import cloudinary from "../config/cloudinary.js";
export const create = async (req, res) => {
    try {
         let data = { ...req.body };

        delete data.profilePic;

if (req.file) {
  const result = await uploadToCloudinary(
    req.file.buffer,
    "socialhub/avatars"
  );

  data.profilePic = {
    url: result.secure_url,
    publicId: result.public_id,
  };
}

    const user = await UserService.create(data);

    user.password = undefined;
        return res.status(200).json({
            success: true,
            data: user,
            meassage: "created Successfully",
            error: {}
        })
    } catch (err) {
        return res.status(500).json({
            data: {},
            meassage: err.meassage,
            error: err
        })
    }

}
export const login = async (req, res) => {
    try {
        const { user, token } = await UserService.login(req.body);
        if (!user) {
            return res.status(404).json({
                data: {},
                error: {},
                success: false,
                message: "User Not Found"
            });
        }
        res.status(200).cookie("passtoken", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
        }).json({ token });


    } catch (err) {
        return res.status(500).json({
            data: {},
            error: err,
            success: false,
            message: err.message
        });
    }

}
export const getuser = async (req, res) => {
    try {
        const user = await UserService.getUser(req.user.user);
        return res.status(200).json({
            data: user,
            error: {},
            success: true,
            message: "User Fetched Successfully"
        });
    } catch (err) {
        return res.status(500).json({
            data: {},
            error: err,
            success: false,
            message: err.message
        });


    }
}
export const update = async (req, res) => {
  try {
    const userId = req.user.user._id; 
    let data = { ...req.body };
    delete data.password;

    delete data.profilePic;

    const existingUser = await UserService.getbyid(userId);

    if (req.file) {
  if (existingUser?.profilePic?.publicId) {
    try {
      const res=await cloudinary.uploader.destroy(
        existingUser.profilePic.publicId);
    } catch (err) {
      console.error(
        "Cloudinary delete failed:",
        err.message
      );
    }
  }

  const result = await uploadToCloudinary(
    req.file.buffer,
    "socialhub/avatars"
  );

  data.profilePic = {
    url: result.secure_url,
    publicId: result.public_id,
  };
}
    

    const user = await UserService.update(userId, data);
    user.password = undefined;
        return res.status(200).json({
            success: true,
            data: user,
            meassage: "updated Successfully",
            error: {}
        })
    }catch (err) {
        return res.status(500).json({
            data: {},
            meassage: err.meassage,
            error: err
        })
    }

}

