import FollowService from "../Services/FollowService.js"
const followService = new FollowService();

export const toggleFollow = async (req, res) => {
  try {
    const { userId } = req.params;

    const isFollowing = await followService.toggleFollow({
      followerId: req.user.user._id,
      followingId: userId,
    });

    return res.status(200).json({
      success: true,
      message: isFollowing ? "Followed" : "Unfollowed",
      isFollowing,
    });
  } catch (err) {
    console.log("Controller Error (toggleFollow):", err);

    if (err.message === "You cannot follow yourself") {
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }

    if (err.message === "User not found") {
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


export const getFollowers = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page, limit } = req.query;

    const followers = await followService.getFollowers({
      userId,
      page,
      limit,
    });

    return res.status(200).json({
      success: true,
      message: "Followers fetched successfully",
      count: followers.length,
      followers: followers.map((f) => f.followerId),
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getFollowing = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page, limit } = req.query;

    const following = await followService.getFollowing({
      userId,
      page,
      limit,
    });

    return res.status(200).json({
      success: true,
      message: "Following fetched successfully",
      count: following.length,
     following: following.map((f) => f.followingId)
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
export const isFollowing = async (req, res) => {
  try {
    const { userId } = req.params;

    const result = await followService.isFollowing({
      followerId: req.user.user._id,
      followingId: userId,
    });

    return res.status(200).json({
      success: true,
      isFollowing: result,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

