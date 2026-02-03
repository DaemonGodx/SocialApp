import Post from "../models/postSchema.js";
import Follow from "../models/followSchema.js";
import mongoose from "mongoose";
import { buildPostAggregation } from "../aggrigations/postAggregator.js";

export const getFeedService = async ({
  userId,
  limit = 10,
  page,
  cursor
}) => {
  try {
    limit = Math.min(Math.max(parseInt(limit), 1), 50);

    // 1️⃣ Following
    const following = await Follow.find({
      followerId: userId
    }).select("followingId");

    // 2️⃣ Author IDs (self + following)
    const authorIds = [
      new mongoose.Types.ObjectId(userId),
      ...following.map(f => f.followingId)
    ];

    // 3️⃣ Base match
    const match = {
      user: { $in: authorIds }
    };

    // 🔥 CURSOR FILTER (createdAt + _id tie-breaker)
    if (cursor?.createdAt && cursor?._id) {
      match.$or = [
        { createdAt: { $lt: new Date(cursor.createdAt) } },
        {
          createdAt: new Date(cursor.createdAt),
          _id: { $lt: new mongoose.Types.ObjectId(cursor._id) }
        }
      ];
    }

    const pipeline = buildPostAggregation({
      match,
      currentUserId: userId
    });

    let feed = [];
    let hasMore = false;
    let nextCursor = null;

    // 🔥 CURSOR PAGINATION (PRIORITY)
    if (cursor || !page) {
      pipeline.push({ $limit: limit + 1 });

      const result = await Post.aggregate(pipeline);

      hasMore = result.length > limit;
      feed = hasMore ? result.slice(0, limit) : result;

      nextCursor = hasMore? {
            createdAt: feed[feed.length - 1].createdAt,
            _id: feed[feed.length - 1]._id
          }: null;
    }
    // 🔹 PAGE PAGINATION (FALLBACK)
    else {
      page = Math.max(parseInt(page), 1);
      const skip = (page - 1) * limit;

      pipeline.push(
        { $skip: skip },
        { $limit: limit }
      );

      feed = await Post.aggregate(pipeline);
      const totalCount = await Post.countDocuments({
    ...match,
    isDeleted: false
  });

  // 3️⃣ hasMore calculation
  hasMore = page * limit < totalCount;
  nextCursor = null;
    }

    return {
      hasMore,
      nextCursor,
      page: page || null,
      feed,
     
    };

  } catch (err) {
    console.log("Service Error (getFeedService):", err);
    throw err;
  }
};
