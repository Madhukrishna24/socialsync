import mongoose, { mongo } from "mongoose";

const commentSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
  },

  body: {
    type: String,
    default: "",
  },
});

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;
