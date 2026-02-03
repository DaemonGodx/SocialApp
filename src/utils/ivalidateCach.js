import Follow from "../models/followSchema.js";
import { clearByPattern } from "./cache.js";

export async function invalidateFeedForUserAndFollowers(authorId) {
  const followers = await Follow.find({ followingId: authorId })
    .select("followerId");

  const affectedUsers = [
    authorId,
    ...followers.map(f => f.followerId)
  ];

  for (const uid of affectedUsers) {
    await clearByPattern(`feed:user:${uid}:*`);
  }
}
