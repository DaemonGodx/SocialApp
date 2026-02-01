import mongoose from "mongoose";

const likeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

// prevent duplicate likes
likeSchema.index({ userId: 1, postId: 1 }, { unique: true });

// fast likes list for a post
likeSchema.index({ postId: 1, createdAt: -1 });

export default mongoose.model("Like", likeSchema);
