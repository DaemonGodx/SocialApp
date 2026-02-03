import { getFeedService } from "./FeedService.js";

export const getFeed = async (req, res) => {
  try {
    const userId = req.user.user._id;

    const limit = parseInt(req.query.limit) || 10;
    const page = req.query.page ? parseInt(req.query.page) : null;

    // cursor will come as object (createdAt + _id)
    const cursor = req.query.cursor? {
          createdAt: req.query.cursor.createdAt,
          _id: req.query.cursor._id
        }: null;

    const { feed, hasMore, nextCursor } = await getFeedService({
      userId,
      limit,
      page,
      cursor
    });

    return res.status(200).json({
      hasMore,
      nextCursor,
      data: feed,
     
    });

  } catch (err) {
    console.log("Controller Error (getFeed):", err);

    return res.status(500).json({
      data: [],
      message: "Internal server error"
    });
  }
};
