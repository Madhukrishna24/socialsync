import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  createPost,
  deletePost,
  getAllComments,
  getAllposts,
  incrementLinkes,
  postComment,
} from "../../action/postAction";

const initialState = {
  posts: null,
  isError: false,
  isLoadind: false,
  postFetched: false,
  loggedIn: false,
  message: "",
  comments: null,
  postId: "",
  isDeleting: false,
};

const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    reset: () => initialState,
    resetPostId: (state) => {
      state.postId = "";
    },
  },
  extraReducers: (builders) => {
    builders
      .addCase(getAllposts.pending, (state) => {
        state.isLoadind = true;
        state.message = "Posts are Loading ...";
      })
      .addCase(getAllposts.fulfilled, (state, action) => {
        state.isError = false;
        state.postFetched = true;
        state.message = "Posts are fetched..";
        state.posts = action.payload.reverse();
      })
      .addCase(getAllposts.rejected, (state, action) => {
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(createPost.pending, (state) => {
        state.isLoadind = true;
        state.message = "Post Creating ....";
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.isLoadind = false;
        state.message = "Post created successfully";
        state.isError = false;

        state.posts = [action.payload.post, ...state.posts]; // Add the new post to the list
      })
      .addCase(createPost.rejected, (state, action) => {
        state.isLoadind = false;
        state.message = action.payload;
        state.isError = true;
      })
      .addCase(deletePost.pending, (state) => {
        state.isLoadind = true;
        state.message = "Loading ..";
        state.isDeleting = true;
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.isError = false;
        state.message = action.payload.message;
        state.isLoadind = false;
        state.isDeleting = false;
        state.posts = state.posts.filter(
          (post) => post._id !== action.meta.arg.post_id
        );
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.isError = true;
        state.message = action.payload.message;
        state.isLoadind = false;
        state.isDeleting = false;
      })
      .addCase(incrementLinkes.pending, (state) => {
        state.isLoadind = true;
        state.message = "Loading ..";
      })
      .addCase(incrementLinkes.fulfilled, (state, action) => {
        state.isLoadind = false;
        state.message = "Likes incremented successfully";
        state.isError = false;

        const updatedPostId = action.meta.arg.post_id;
        state.posts = state.posts.map((post) =>
          post._id === updatedPostId
            ? { ...post, likes: action.payload.message }
            : post
        );
      })
      .addCase(incrementLinkes.rejected, (state, action) => {
        state.isLoadind = false;
        state.message = action.payload;
        state.isError = true;
      })
      .addCase(getAllComments.pending, (state) => {
        state.isLoadind = true;
        state.message = "Loading ...";
      })
      .addCase(getAllComments.fulfilled, (state, action) => {
        state.isLoadind = false;
        state.postId = action.payload.post_id;
        state.comments = action.payload.comments;
      })
      .addCase(getAllComments.rejected, (state, action) => {
        state.isLoadind = false;
        state.message = action.payload;
        state.isError = true;
      }).addCase(postComment.pending, (state) => {
        state.isLoadind = true;
        state.message = "Loading ...";
      })
      .addCase(postComment.fulfilled, (state, action) => {
        state.isLoadind = false;
        state.isError = false;
        state.message = action.payload.message;
      })
      .addCase(postComment.rejected, (state, action) => {
        state.isLoadind = false;
        state.isError = true;
        state.message = action.payload.message;
      })
  },
});

export const {resetPostId} = postSlice.actions;
export default postSlice.reducer;
