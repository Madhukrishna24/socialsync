import { createSlice } from "@reduxjs/toolkit";
import {
  loginUser,
  registerUser,
  getAboutUser,
  getAllProfiles,
  getConnectionRequests,
  getMyConnectionRequests,
  sendConnectionRequest,
  acceptConnection,
  updateUserProfile,
  updateUserData,
} from "../../action/authAction";

const initialState = {
  user: null,
  isLoading: true,
  isError: false,
  isSuccess: false,
  isLoggedIn: false,
  profileFetched: false,
  message: "",
  connections: null,
  connectionRequests: null,
  all_profiles: [],
  all_profiles_fetched: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    reset: () => initialState,
    handleLogin: (state) => {
      state.message = "Success";
    },
    emptyMessage: (state) => {
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.message = "Loading ....";
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isError = true;
        state.isLoading = false;
        state.message = action.payload;
        state.isSuccess = false;
        state.isLoggedIn = false;
      })
      .addCase(loginUser.fulfilled, (state) => {
        state.isError = false;
        state.isLoading = false;
        state.isSuccess = true;
        state.isLoggedIn = true;
      })
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.message = "Loading ...";
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isError = true;
        state.isLoading = false;
        state.message = action.payload;
        state.isSuccess = false;
        state.isLoggedIn = false;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isError = false;
        state.isLoading = false;
        state.message = action.payload;
        state.isSuccess = true;
      })
      .addCase(getAboutUser.pending, (state) => {
        state.isLoading = true;
        state.message = "Loading user data ...";
        state.profileFetched = false;
      })
      .addCase(getAboutUser.rejected, (state, action) => {
        state.isError = true;
        state.isLoading = false;
        state.message = action.payload;
        state.profileFetched = false;
      })
      .addCase(getAboutUser.fulfilled, (state, action) => {
        state.isError = false;
        state.isLoading = false;
        state.user = action.payload;
        state.message = "";
        state.isSuccess = true;
        state.profileFetched = true;
      })
      .addCase(getAllProfiles.pending, (state) => {
        state.isLoading = true;
        state.message = "Loading Profiles ...";
        state.all_profiles_fetched = false;
      })
      .addCase(getAllProfiles.fulfilled, (state, action) => {
        state.all_profiles_fetched = true;
        state.message = "Profiles fetched";
        state.all_profiles = action.payload.profiles;
      })
      .addCase(getAllProfiles.rejected, (state, action) => {
        state.all_profiles_fetched = false;
        state.message = action.payload;
      })
      .addCase(getConnectionRequests.fulfilled, (state, action) => {
        state.message = "Connections fetched";
        state.connections = action.payload.requests;
      })
      .addCase(getConnectionRequests.rejected, (state, action) => {
        state.message = action.payload;
      })
      .addCase(getMyConnectionRequests.fulfilled, (state, action) => {
        state.message = "Connection requests fetched";
        state.connectionRequests = action.payload;
      })
      .addCase(getMyConnectionRequests.rejected, (state, action) => {
        state.message = action.payload;
      })
      .addCase(sendConnectionRequest.fulfilled, (state, action) => {
        state.message = "Connection request sent";
      })
      .addCase(sendConnectionRequest.rejected, (state, action) => {
        state.message = action.payload;
      })
      .addCase(acceptConnection.fulfilled, (state, action) => {
        state.message = "Connection request accepted";
      })
      .addCase(acceptConnection.rejected, (state, action) => {
        state.message = action.payload;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.message = action.payload.message;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.message = action.payload.message;
        state.isError = true;
      })
      .addCase(updateUserData.fulfilled, (state, action) => {
        state.message = action.payload.message;
        state.isError = false;
      })
      .addCase(updateUserData.rejected, (state, action) => {
        state.message = action.payload.message;
        state.isError = true;
      });
  },
});

export const { handleLogin, emptyMessage, reset } = authSlice.actions;
export default authSlice.reducer;
