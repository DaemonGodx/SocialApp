import { Queue } from "bullmq";
import { redis as connection } from "../config/redisConfig.js";

export const notificationQueue = new Queue("notification-queue", {
  connection
});
