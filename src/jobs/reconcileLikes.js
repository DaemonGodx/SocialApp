import cron from "node-cron";
import Like from "../models/likeSchema.js";
import Post from "../models/postSchema.js";
import { redis } from "../config/redisConfig.js";

/**
 * Runs every 2 hours:
 * 1) Count real likes from Like collection (truth)
 * 2) Fix Post.likesCount in Mongo
 * 3) Fix Redis counter
 */
export function startLikeReconciliationJob() {
  console.log("Reconciliation job scheduled (every 2 hours)");

 cron.schedule("0 */2 * * *", async () => {
  console.log(" Starting like reconciliation job...");

  try {
    const keys = await redis.keys("post:meta:*");

    for (let key of keys) {
      const postId = key.split(":")[2];

      const realLikes = await Like.countDocuments({ postId });

      await Post.updateOne(
        { _id: postId },
        { $set: { likesCount: realLikes } }
      );

      await redis.hset(key, {
        likes: String(realLikes),
        updatedAt: String(Date.now())
      });

      console.log(` Reconciled post ${postId} → ${realLikes} likes`);
    }
    

    console.log("Like reconciliation completed.");
  } catch (err) {
    console.error("Reconciliation failed:", err);
  }
});
}