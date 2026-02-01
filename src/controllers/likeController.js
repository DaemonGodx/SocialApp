import LikeService from "../Services/likeService.js";

const likeService = new LikeService();

export const toggleLike = async (req, res) => {
  try {
    const { postId } = req.params;

    const isLiked = await likeService.toggleLike({
      userId: req.user.user._id,
      postId,
    });

    return res.status(200).json({
      success: true,
      message: isLiked ? "Liked" : "Unliked",
      isLiked,
    });
  } catch (err) {
    console.log("Controller Error (toggleLike):", err);

    if (err.message === "Post not found") {
      return res.status(404).json({
        success: false,
        message: err.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

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
