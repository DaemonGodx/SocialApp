import { Queue } from "bullmq";
import { redis as connection } from "../config/redisConfig.js";

export const likeQueue = new Queue("like-events", {
  connection,
});
