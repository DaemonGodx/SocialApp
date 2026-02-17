import LikeService from "../Services/likeService.js";
import { likeQueue } from "../queues/likeQueue.js";
import {redis} from "../config/redisConfig.js";
import { notificationQueue } from "../queues/notificationQueue.js";

const likeService = new LikeService();
export const toggleLike = async (req, res) => {
  try {
    const { postId } = req.params;
    const { isLiked,ownerId} = req.body;   // <-- comes from your feed UI
    const userId = req.user.user._id;

    const metaKey = `post:meta:${postId}`;
    const exists = await redis.exists(metaKey);
    if (!exists) {
      await redis.hset(metaKey, {
        likes: 0,
        comments: 0,
        updatedAt: Date.now()
      });
    }

    if (isLiked) {
      // User is UNLIKING
      await redis.hincrby(metaKey, "likes", -1);
      await redis.expire(metaKey, 2*60*60);


      await likeQueue.add("like-event", {
        postId,
        userId,
        action: "UNLIKE",
      },
     {
    removeOnComplete: true,
    removeOnFail: false,
    attempts: 5,
    backoff: {
      type: "exponential",
      delay: 2000
    },
    ttl: 5 * 60 * 1000   
  });
    } else {
      // User is LIKING
      await redis.hincrby(metaKey, "likes", 1);
      await redis.expire(metaKey, 2*60*60);
      await likeQueue.add("like-event", {
        postId,
        userId,
        action: "LIKE",
      },
    {
  
    attempts: 5,
    ttl: 5 * 60 * 1000,
    backoff: {
      type: "exponential",
      delay: 2000
    }  , 
      removeOnComplete: true,
    removeOnFail: false,
  });
   await notificationQueue.add(
    "notify-like",
    {
      userId: ownerId,      // receiver (important!)
      actorId: userId,          // who liked
      type: "LIKE",
      entityId: postId
    },
    {
      removeOnComplete: true,
      jobId: `LIKE:${userId}:${postId}`  // prevent duplicates
    }
  );
    }

    // Get fresh count from Redis (NO Mongo hit)
    const likesCount = await redis.hget(metaKey, "likes");
    


    return res.status(200).json({
      success: true,
      isLiked: !isLiked,            // flip state for frontend
      likesCount: Number(likesCount)
    });


  } catch (err) {
    console.error("Controller Error (toggleLike):", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


// export const toggleLike = async (req, res) => {
//   try {
//     const { postId } = req.params;

//     const isLiked = await likeService.toggleLike({
//       userId: req.user.user._id,
//       postId,
//     });

//     return res.status(200).json({
//       success: true,
//       message: isLiked ? "Liked" : "Unliked",
//       isLiked,
//     });
//   } catch (err) {
//     console.log("Controller Error (toggleLike):", err);

//     if (err.message === "Post not found") {
//       return res.status(404).json({
//         success: false,
//         message: err.message,
//       });
//     }

//     return res.status(500).json({
//       success: false,
//       message: "Internal server error",
//     });
//   }
// };

export const getLikesByPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { page, limit } = req.query;

    const likes = await likeService.getLikesByPost({ postId, page, limit });

    return res.status(200).json({
      success: true,
      message: "Likes fetched successfully",
      count: likes.length,
      likes,
    });
  } catch (err) {
    console.log("Controller Error (getLikesByPost):", err);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
