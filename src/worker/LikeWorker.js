import { Worker } from "bullmq";
import { redis as connection} from "../config/redisConfig.js";
import LikeService from "../Services/likeService.js";
import config from "../config/config.js";
import connect from "../connections/index.js";
await connect(config.url);
console.log("Mongo connected in worker");

const likeService = new LikeService();

const worker = new Worker(
  "like-events",
  async (job) => {
    const { postId, userId, action } = job.data;

    console.log("Processing job:", job.data);

    await likeService.processLikeEvent({
      postId,
      userId,
      action,
    });
  },
  { connection }
);

worker.on("completed", (job) => {
  console.log(`Job ${job.id} completed`);
});

worker.on("failed", (job, err) => {
  console.error(`Job ${job.id} failed:`, err);
});
