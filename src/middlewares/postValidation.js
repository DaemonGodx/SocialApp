import mongoose from "mongoose";

export const validatePostIdParam = (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid post id",
    });
  }

  next();
};
export const validateUserIdParam = (req, res, next) => {
  const { userId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid user id",
    });
  }

  next();
};

export const validateCreatePost = (req, res, next) => {
  const { content } = req.body;

  if (typeof content !== "string") {
    return res.status(400).json({
      success: false,
      message: "Content must be a string",
    });
  }

  const trimmed = content.trim();

  if (trimmed.length < 5) {
    return res.status(400).json({
      success: false,
      message: "Post content must be at least 5 characters",
    });
  }

  if (trimmed.length > 2000) {
    return res.status(400).json({
      success: false,
      message: "Post content must be less than 2000 characters",
    });
  }

  req.body.content = trimmed;

  next();
};

export const validateUpdatePost = (req, res, next) => {
  const { content } = req.body;

  if (typeof content !== "string") {
    return res.status(400).json({
      success: false,
      message: "Content must be a string",
    });
  }

  const trimmed = content.trim();

  if (trimmed.length < 5) {
    return res.status(400).json({
      success: false,
      message: "Post content must be at least 5 characters",
    });
  }

  if (trimmed.length > 2000) {
    return res.status(400).json({
      success: false,
      message: "Post content must be less than 2000 characters",
    });
  }

  req.body.content = trimmed;

  next();
};
export const validatePaginationQuery = (req, res, next) => {
  let { page = "1", limit = "10" } = req.query;

  page = parseInt(page);
  limit = parseInt(limit);

  if (Number.isNaN(page) || page < 1) page = 1;
  if (Number.isNaN(limit) || limit < 1) limit = 10;
  if (limit > 50) limit = 50;

  req.query.page = page;
  req.query.limit = limit;

  next();
};
