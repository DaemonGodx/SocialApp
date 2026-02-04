import { likeQueue } from "./queues/likeQueue.js";

await likeQueue.add("like-event", {
  postId: "6982586c102c1234b341e47c",
  userId: "697f24d491f0c5a354c0e9b7",
  action: "LIKE",
});

console.log("Test job added!");
process.exit(0);
