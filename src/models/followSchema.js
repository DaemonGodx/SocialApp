import mongoose from "mongoose";

const followSchema = new mongoose.Schema(
  {
    followerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true, 
    },
    followingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true, 
    },
  },
  { timestamps: true }
);

/**
 * Prevent duplicate follows:
 * A -> B can exist only once
 */
followSchema.index({ followerId: 1, followingId: 1 }, { unique: true });

/**
 * Fast followers list (recent first):
 * Find by followingId + sort by createdAt
 */
followSchema.index({ followingId: 1, createdAt: -1 });

/**
 * Fast following list (recent first):
 * Find by followerId + sort by createdAt
 */
followSchema.index({ followerId: 1, createdAt: -1 });

const Follow = mongoose.model("Follow", followSchema);
export default Follow;
