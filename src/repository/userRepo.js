import User from "../models/userSchema.js"
import { buildProfileAggregation } from "../aggrigations/profileAggregator.js";
import mongoose from "mongoose";


class UserRepo {
    async create(data) {
        try {
            const user = await User.create({
                name: data.name,
                password: data.password,
                email: data.email,
                username: data.username,
                profilePic: data.profilePic

            })
            await user.save();
            return user
        } catch (err) {
            console.log("Repository Layer Error ", err)
            throw err
        }

    }
    async getCurrentuser(data) {
        try {
            const user = await User.findById(data._id)
            return user
        } catch (err) {
            console.log("Repository Layer Error ", err)
            throw err
        }

    }
    async getById(id) {
  return await User.findById(id);
}
 async get(data) {
        try {
            const user = await User.findOne({ email: data.email })
            return user
        } catch (err) {
            console.log("Repository Layer Error ", err)
            throw err
        }
    }
async getProfileDetails({ profileuserId, currentUserId }) {
  const pipeline = buildProfileAggregation({
    profileuserId,
    currentUserId
  });

  const result = await User.aggregate(pipeline);
  return result[0];


}
    async update(id, data) {
        try {
            delete data.password;
            Object.keys(data).forEach(
                key => data[key] === undefined && delete data[key]
            );

            const user = await User.findByIdAndUpdate(id, { $set: data }, { new: true });
            return user
        }
        catch (err) {
            console.log("Repository Layer Error ", err)
            throw err
        }
    }
}

export default UserRepo
