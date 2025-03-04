import Comment from "../models/comments.model.js";
import Post from "../models/posts.model.js";
import User from "../models/user.model.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const activeCheck = (req, res) => {
  return res.status(200).json({ message: "Running" });
};

const createPost = async (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(400).json({ message: "Invalid token" });
  try {
    const user = await User.findOne({ token });
    if (!user) return res.status(404).json({ message: "User not found" });

    const post = new Post({
      userId: user._id,
      body: req.body.body,
      media: req.file !== undefined ? req.file.filename : "",
      fileType: req.file !== undefined ? req.file.mimetype.split("/")[1] : "",
    });
    await post.save();
    const savedPost = await Post.findOne({_id:post._id}).populate(
      "userId",
      "username name email profilePicture"
    );
    res.status(201).json({ message: "Post created", post: savedPost });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getUserPosts = async (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(400).json({ message: "Invalid token" });
  try {
    const user = await User.findOne({ token });
    if (!user) return res.status(404).json({ message: "User not found" });
    const posts = await Post.find({ userId: user._id });
    return res.status(200).json(posts);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate(
      "userId",
      "username name email profilePicture"
    );
    return res.status(200).json(posts);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const deletePost = async (req, res) => {
  const { user_id, post_id } = req.body;

  try {
    const user = await User.findOne({ _id: user_id });
    if (!user) return res.status(404).json({ message: "User not found" });

    const post = await Post.findOne({ _id: post_id });
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.userId.toString() !== user._id.toString())
      return res.status(401).json({ message: "Unauthorized" });

    const mediaPath = path.join(__dirname, "../uploads/posts/", post.media);

    if (fs.existsSync(mediaPath)) {
      fs.unlinkSync(mediaPath);
    }

    await Post.deleteOne({ _id: post_id });
    return res
      .status(200)
      .json({ message: "Post deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
const commentPost = async (req, res) => {
  const { token, post_id, commentBody } = req.body;
  if (!token) return res.status(400).json({ message: "Invalid token" });
  try {
    const user = await User.findOne({ token });
    if (!user) return res.status(404).json({ message: "User not found" });

    const post = await Post.findOne({ _id: post_id });
    if (!post) return res.status(404).json({ message: "Post not found" });
    const comment = new Comment({
      userId: user._id,
      postId: post_id,
      body: commentBody,
    });

    await comment.save();
    post.comments.push(comment._id);
    await post.save();
    return res.status(201).json({ message: "Comment created"});
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getCommentsForPost = async (req, res) => {
  const { post_id } = req.query;
  try {
    const post = await Post.findById(post_id).populate({
      path: "comments",
      select: "_id body",
      populate: {
        path: "userId",
        select: "name email profilePicture _id username",
      },
    });
    if (!post) return res.status(404).json({ message: "Post not found" });

    return res.status(200).json({ comments: post.comments });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const deleteComment = async (req, res) => {
  const { token, comment_id } = req.body;
  if (!token) return res.status(400).json({ message: "Invalid token" });
  try {
    const user = await User.findOne({ token });
    if (!user) return res.status(404).json({ message: "User not found" });
    const comment = await Comment.findOne({ _id: comment_id });
    if (!comment) return res.status(404).json({ message: "Comment not found" });
    if (comment.UserId.toString() !== user._id)
      return res.status(403).json({ message: "Unauthorized" });
    // const post = await Post.findOne({ _id: comment.postId });
    // if (!post) return res.status(404).json({ message: "Post not found" });
    await Comment.findByIdAndDelete(comment_id);

    await Post.findByIdAndDelete(comment.postId, {
      $pull: { commets: comment_id },
    });
    return res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const incrementLikes = async (req, res) => {
  const { post_Id } = req.body;
  
  try {
    const post = await Post.findOne({ _id: post_Id });
    if (!post) return res.status(404).json({ message: "Post not found" });
    post.likes = post.likes+1;
    await post.save();
    
    return res.status(200).json({ message: post.likes });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export {
  activeCheck,
  createPost,
  getAllPosts,
  deletePost,
  getUserPosts,
  commentPost,
  getCommentsForPost,
  incrementLikes,
  deleteComment,
};
