import mongoose from "mongoose"

const postSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 2000,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
    likesCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    commentsCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    image: {
      url: { type: String },
      publicId: { type: String },
    }

  },
  { timestamps: true }
);

postSchema.index({ createdAt: -1 });

const Post = mongoose.model("Post", postSchema);
export default Post;
