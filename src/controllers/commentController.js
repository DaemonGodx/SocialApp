import CommentService from "../Services/commentService.js";

const commentService = new CommentService();

export const createComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { content, parentCommentId } = req.body;

    const comment = await commentService.createComment({
      postId,
      userId: req.user.user._id,
      content,
      parentCommentId,
    });

    return res.status(201).json({
      success: true,
      message: parentCommentId ? "Reply added successfully" : "Comment added successfully",
      comment,
    });
  } catch (err) {
    console.log("Controller Error (createComment):", err);

    if (err.message === "Post not found") {
      return res.status(404).json({ success: false, message: err.message });
    }

    if (err.message === "Parent comment not found") {
      return res.status(404).json({ success: false, message: err.message });
    }

    if (err.message === "Comment content is required") {
      return res.status(400).json({ success: false, message: err.message });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getCommentsByPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { page, limit, parentCommentId } = req.query;

    const comments = await commentService.getCommentsByPost({
      postId,
      parentCommentId: parentCommentId || null,
      page,
      limit,
    });

    return res.status(200).json({
      success: true,
      message: parentCommentId ? "Replies fetched successfully" : "Comments fetched successfully",
      count: comments.length,
      comments,
    });
  } catch (err) {
    console.log("Controller Error (getCommentsByPost):", err);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;

    const deleted = await commentService.deleteComment({
      commentId,
      userId: req.user.user._id,
    });

    return res.status(200).json({
      success: true,
      message: "Comment deleted successfully",
      comment: deleted,
    });
  } catch (err) {
    console.log("Controller Error (deleteComment):", err);

    if (
      err.message === "Comment not found" ||
      err.message === "Comment already deleted"
    ) {
      return res.status(404).json({ success: false, message: err.message });
    }

    if (err.message === "Not allowed") {
      return res.status(403).json({ success: false, message: err.message });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
export const getReplies = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { page, limit } = req.query;

    const replies = await commentService.getReplies({ commentId, page, limit });

    return res.status(200).json({
      success: true,
      message: "Replies fetched successfully",
      count: replies.length,
      replies,
    });
  } catch (err) {
    console.log("Controller Error (getReplies):", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

