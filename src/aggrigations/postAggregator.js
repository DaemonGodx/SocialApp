import mongoose from "mongoose";

export const buildPostAggregation = ({ match, currentUserId }) => {
  const pipeline = [];

  // 1️⃣ Match
  pipeline.push({
    $match: {
      ...match,
      isDeleted: false
    }
  });

  // 2️⃣ STABLE SORT (VERY IMPORTANT)
  pipeline.push({
    $sort: { createdAt: -1, _id: -1 }
  });

  // 3️⃣ Author lookup
  pipeline.push(
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "author"
      }
    },
    { $unwind: "$author" }
  );

  // 4️⃣ isLikedByMe
  if (currentUserId) {
    pipeline.push(
      {
        $lookup: {
          from: "likes",
          let: { postId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$postId", "$$postId"] },
                    {
                      $eq: [
                        "$userId",
                        new mongoose.Types.ObjectId(currentUserId)
                      ]
                    }
                  ]
                }
              }
            }
          ],
          as: "myLike"
        }
      },
      {
        $addFields: {
          isLikedByMe: { $gt: [{ $size: "$myLike" }, 0] }
        }
      }
    );
  }

  // 5️⃣ Cleanup
  pipeline.push({
    $project: {
      user: 0,
      myLike: 0,
      __v: 0,
      "author.password": 0,
      "author.__v": 0
    }
  });

  return pipeline;
};
