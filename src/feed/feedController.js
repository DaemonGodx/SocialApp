import { getFeedService } from "./FeedService.js";
import { getOrSetCache } from "../utils/cache.js";
import { normalizeCursor } from "../utils/validateCursor.js";


export const getFeed = async (req, res) => {
  try {
    const userId = req.user.user._id;

    const limit = parseInt(req.query.limit) || 10;
    const page = req.query.page ? parseInt(req.query.page) : null;

    const cursor = normalizeCursor(req.query.cursor);


    const cacheKey = `feed:user:${userId}:page:${page || "none"}:cursor:${
      cursor ? cursor.createdAt + "_" + cursor._id : "start"
    }:limit:${limit}`;

    const result = await getOrSetCache(cacheKey, async () => {
      return await getFeedService({
        userId,
        limit,
        page,
        cursor,
      });
    }, 2*60); // 60 seconds TTL (we can tune later)

    return res.status(200).json({
      hasMore: result.hasMore,
      nextCursor: result.nextCursor,
      data: result.feed,
    });

  } catch (err) {
    console.log("Controller Error (getFeed):", err);

    return res.status(500).json({
      data: [],
      message: "Internal server error",
    });
  }
};
