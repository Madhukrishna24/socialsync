import { Router } from "express";
import { activeCheck, commentPost, createPost, deleteComment, deletePost, getAllPosts, getCommentsForPost, getUserPosts, incrementLikes } from "../controllers/posts.controller.js";
import multer from "multer";

const storage = multer.diskStorage({
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
  destination: (req, file, cb) => {
    cb(null, "uploads/posts/");
  },
});
const posts = multer({ storage });
const routers = Router();

routers.route("/").get(activeCheck);

routers.route("/post").post(posts.single("media"), createPost)
routers.route("/posts").get(getAllPosts);
routers.route("/user_posts").get(getUserPosts);
routers.route("/delete").delete(deletePost);

routers.route("/comment").post(commentPost);
routers.route("/comments").get(getCommentsForPost);

routers.route("/delete_comment").delete(deleteComment);
routers.route("/like").post(incrementLikes);


export default routers;
