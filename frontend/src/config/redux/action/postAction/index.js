import clientServer from "@/config";
import { createAsyncThunk } from "@reduxjs/toolkit";

const getAllposts = createAsyncThunk(
  "post/getAllPosts",
  async (_, thunkAPI) => {
    try {
      const response = await clientServer.get("/posts");

      return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
      if (error.response && error.response.data) {
        return thunkAPI.rejectWithValue(error.response.data);
      }
      return thunkAPI.rejectWithValue("An unexpected error occurred");
    }
  }
);

const createPost = createAsyncThunk(
  "post/createPost",
  async (userData, thunkAPI) => {
    try {
      const { media, body } = userData;
      const formData = new FormData();
      formData.append("token", localStorage.getItem("token"));
      formData.append("media", media);
      formData.append("body", body);

      const response = await clientServer.post("/post", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
      if (error.response && error.response.data) {
        return thunkAPI.rejectWithValue(error.response.data);
      }
      return thunkAPI.rejectWithValue("An unexpected error occurred");
    }
  }
);

const deletePost = createAsyncThunk(
  "post/deletePost",
  async (userData, thunkAPI) => {
    try {
      const { post_id, user_id } = userData;
      const response = await clientServer.delete("/delete", {
        data: { post_id, user_id },
      });
      return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
      if (error.response && error.response.data) {
        return thunkAPI.rejectWithValue(error.response.data);
      }
      return thunkAPI.rejectWithValue("An unexpected error occurred");
    }
  }
);

const incrementLinkes = createAsyncThunk(
  "post/incrementLike",
  async(post_Id, thunkAPI) => {
    try {
      const response = await clientServer.post("/like", {
        post_Id
      });

      return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
      if (error.response && error.response.data) {
        return thunkAPI.rejectWithValue(error.response.data);
      }
      return thunkAPI.rejectWithValue("An unexpected error occurred");
    }
  }
);


const getAllComments = createAsyncThunk(
  "post/getAllComments",
  async(post_id, thunkAPI) => {
    try {
      const response = await clientServer.get("/comments", {
        params: {
          post_id: post_id,
        }
      });
      return thunkAPI.fulfillWithValue({
        post_id: post_id,
        comments: response.data.comments,
      });
    } catch (error) {
      if (error.response && error.response.data) {
        return thunkAPI.rejectWithValue(error.response.data);
      }
      return thunkAPI.rejectWithValue("An unexpected error occurred");
    }
  }
)

const postComment = createAsyncThunk(
  "post/postComment",
  async(commentData, thunkAPI) => {
    try {
      const response = await clientServer.post("/comment", {
        token: localStorage.getItem("token"),
        post_id: commentData.post_id,
        commentBody: commentData.commentBody
      })
      return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
      if (error.response && error.response.data) {
        return thunkAPI.rejectWithValue(error.response.data);
      }
      return thunkAPI.rejectWithValue("An unexpected error occurred");
    }
  }
)

export { getAllposts, createPost, deletePost, incrementLinkes, getAllComments, postComment };
