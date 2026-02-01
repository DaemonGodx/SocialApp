import mongoose from "mongoose";
import User from "../models/userSchema.js";
import FollowRepo from "../repository/followRepo.js";

const followRepo = new FollowRepo();


class FollowService {
    async toggleFollow({ followerId, followingId }) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      if (followerId.toString() === followingId.toString()) {
        throw new Error("You cannot follow yourself");
      }

      const targetExists = await User.exists({ _id: followingId }).session(session);
      if (!targetExists) throw new Error("User not found");

      const existing = await followRepo.findFollow(
        { followerId, followingId },
        session
      );

      if (existing) {
        await followRepo.deleteById({ followId: existing._id }, session);

        await User.updateOne(
          { _id: followerId, followingCount: { $gt: 0 } },
          { $inc: { followingCount: -1 } },
          { session }
        );

        await User.updateOne(
          { _id: followingId, followersCount: { $gt: 0 } },
          { $inc: { followersCount: -1 } },
          { session }
        );

        await session.commitTransaction();
        return false;
      }

      await followRepo.createFollow({ followerId, followingId }, session);

      await User.updateOne(
        { _id: followerId },
        { $inc: { followingCount: 1 } },
        { session }
      );

      await User.updateOne(
        { _id: followingId },
        { $inc: { followersCount: 1 } },
        { session }
      );

      await session.commitTransaction();
      return true;
    } catch (err) {
      await session.abortTransaction();
      throw err;
    } finally {
      session.endSession();
    }
  }
    async getFollowers({ userId, page = 1, limit = 20 }) {
        try{return followRepo.getFollowers({ userId, page, limit });}
        catch(err)
        {
            throw err;
        }
        
    }

    async getFollowing({ userId, page = 1, limit = 20 }) {
        try{return followRepo.getFollowing({ userId, page, limit });}
        catch(err)
        {
            throw err;
        }
        
    }
    async isFollowing({ followerId, followingId }) {
        try {
            if (followerId.toString() === followingId.toString()) {
                return false;
            }

            const exists = await followRepo.isFollowing({ followerId, followingId });
            return !!exists;
        } catch (err) {
            throw err;

        }

    }

}

export default FollowService;

