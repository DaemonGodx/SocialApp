import mongoose from "mongoose";

export const buildProfileAggregation = ({
  profileuserId,
  currentUserId
}) => {
  return [
    // 1️⃣ Match profile user
    {
      $match: {
        _id: new mongoose.Types.ObjectId(profileuserId)
      }
    },

    // 2️⃣ Check follow relation (isFollowing)
    {
      $lookup: {
        from: "follows",
        let: { profileUserId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  {
                    $eq: [
                      "$followerId",
                      new mongoose.Types.ObjectId(currentUserId)
                    ]
                  },
                  { $eq: ["$followingId", "$$profileUserId"] }
                ]
              }
            }
          }
        ],
        as: "followRelation"
      }
    },

    // 3️⃣ Derive boolean
    {
      $addFields: {
        isFollowing: { $gt: [{ $size: "$followRelation" }, 0] }
      }
    },

    // 4️⃣ Cleanup
    {
      $project: {
        password: 0,
        __v: 0,
        followRelation: 0
      }
    }
  ];
};
