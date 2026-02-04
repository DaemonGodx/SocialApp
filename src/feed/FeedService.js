import Post from "../models/postSchema.js";
import Follow from "../models/followSchema.js";
import mongoose from "mongoose";
import { buildPostAggregation } from "../aggrigations/postAggregator.js";
import { redis } from "../config/redisConfig.js"; // <-- YOUR redis client

function isValidCursor(c) {
  if (!c) return false;
  if (!c.createdAt || !c._id) return false;
  if (!mongoose.Types.ObjectId.isValid(c._id)) return false;

  const d = new Date(c.createdAt);
  return !isNaN(d.getTime());
}

/**
 * Attach real-time likesCount from Redis
 * (Mongo still decides isLiked)
 */
async function attachRedisLikes(feed) {
  for (let post of feed) {
    const meta = await redis.hgetall(`post:meta:${post._id}`);

    if (meta && meta.likes !== undefined) {
      post.likesCount = Number(meta.likes);
    }
  }
}

export const getFeedService = async ({
  userId,
  limit = 10,
  page,
  cursor
}) => {
  try {
    limit = Math.min(Math.max(parseInt(limit), 1), 50);

    const following = await Follow.find({
      followerId: userId
    }).select("followingId");

    const authorIds = [
      new mongoose.Types.ObjectId(userId),
      ...following.map(f => f.followingId)
    ];

    const match = {
      user: { $in: authorIds }
    };

    if (!isValidCursor(cursor)) {
      cursor = null;
    } else {
      const exists = await Post.exists({ _id: cursor._id });
      if (!exists) cursor = null;
    }

    if (cursor) {
      const cursorDate = new Date(cursor.createdAt);

      if (!isNaN(cursorDate.getTime())) {
        match.$or = [
          { createdAt: { $lt: cursorDate } },
          {
            createdAt: cursorDate,
            _id: { $lt: new mongoose.Types.ObjectId(cursor._id) }
          }
        ];
      }
    }

    const pipeline = buildPostAggregation({
      match,
      currentUserId: userId
    });

    let feed = [];
    let hasMore = false;
    let nextCursor = null;

    // ======== CURSOR BASED FLOW ========
    if (cursor || !page) {
      pipeline.push({ $limit: limit + 1 });

      const result = await Post.aggregate(pipeline);

      hasMore = result.length > limit;
      feed = hasMore ? result.slice(0, limit) : result;

      nextCursor = hasMore
        ? {
            createdAt: feed[feed.length - 1].createdAt,
            _id: feed[feed.length - 1]._id
          }
        : null;

      // ✅ Align likesCount with Redis
      await attachRedisLikes(feed);
    }

    // ======== PAGE BASED FLOW ========
    else {
      page = Math.max(parseInt(page), 1);
      const skip = (page - 1) * limit;

      pipeline.push(
        { $skip: skip },
        { $limit: limit }
      );

      feed = await Post.aggregate(pipeline);

      // ✅ Align likesCount with Redis
      await attachRedisLikes(feed);

      const totalCount = await Post.countDocuments({
        ...match,
        isDeleted: false
      });

      hasMore = page * limit < totalCount;
      nextCursor = null;
    }

    return {
      hasMore,
      nextCursor,
      page: page || null,
      feed
    };

  } catch (err) {
    console.log("Service Error (getFeedService):", err);
    throw err;
  }
};
