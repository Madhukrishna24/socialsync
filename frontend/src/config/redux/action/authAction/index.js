import clientServer from "@/config";
import { createAsyncThunk } from "@reduxjs/toolkit";

const loginUser = createAsyncThunk("user/login", async (user, thunkAPI) => {
  try {
    const response = await clientServer.post("/login", {
      email: user.email,
      password: user.password,
    });

    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
    } else {
      return thunkAPI.rejectWithValue("Invalid token");
    }

    // return response.data.token;
  } catch (error) {
    if (error.response && error.response.data) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
    return thunkAPI.rejectWithValue("An unexpected error occurred");
  }
});

const registerUser = createAsyncThunk(
  "user/register",
  async (user, thunkAPI) => {
    try {
      const response = await clientServer.post("/register", {
        email: user.email,
        name: user.name,
        username: user.username,
        password: user.password,
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

const getAboutUser = createAsyncThunk(
  "user/getAboutUser",
  async (_, thunkAPI) => {
    
    try {
      const response = await clientServer.get("/user", {
        headers: {
          Authorization: localStorage.getItem("token"),
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


const getAllProfiles = createAsyncThunk(
  "user/getAllProfiles",
  async (_, thunkAPI) => {
    try {
      const response = await clientServer.get("/profiles");
      return thunkAPI.fulfillWithValue(response.data)
    } catch (error) {
      if (error.response && error.response.data) {
        return thunkAPI.rejectWithValue(error.response.data);
      }
      return thunkAPI.rejectWithValue("An unexpected error occurred");
    }
  }
)


const sendConnectionRequest = createAsyncThunk(
  "auth/sendConnectionRequest",
  async(connectionId, thunkAPI) => {
    try {
      const response = await clientServer.post(
        "/user/send_connection_request",
        {
          token: localStorage.getItem("token"),
          connectionId 
        }
      );
      thunkAPI.dispatch(getConnectionRequests());
      thunkAPI.dispatch(getMyConnectionRequests());
      return thunkAPI.fulfillWithValue(response.data)
    } catch (error) {
      if (error.response && error.response.data) {
        return thunkAPI.rejectWithValue(error.response.data);
      }
      return thunkAPI.rejectWithValue("An unexpected error occurred");
    }
  }
)

const getConnectionRequests = createAsyncThunk(
  "auth/getConnectionRequests",
  async (_, thunkAPI) => {
    try {
      const response = await clientServer.get("/user/get_connection_request", {
        params: {
          token: localStorage.getItem("token"),
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

const getMyConnectionRequests = createAsyncThunk(
  "auth/getMyConnectionRequests",
  async (_, thunkAPI) => {
    try {
      const response = await clientServer.get("/user/user_connection_request", {
        params: {
          token: localStorage.getItem("token")
        }
      });
      return thunkAPI.fulfillWithValue(response.data)
    } catch (error) {
      if (error.response && error.response.data) {
        return thunkAPI.rejectWithValue(error.response.data);
      }
      return thunkAPI.rejectWithValue("An unexpected error occurred");
    }
  }
);

const acceptConnection = createAsyncThunk(
  "auth/acceptConnection",
  async(user, thunkAPI) => {
    try {
      const response = await clientServer.post(
        "/user/accept_connection_request",
        {
          token: localStorage.getItem("token"),
          requestId: user.connectionId,
          action_type: user.action
        }
      );
      thunkAPI.dispatch(getMyConnectionRequests())
      thunkAPI.dispatch(getConnectionRequests());
      return thunkAPI.fulfillWithValue(response.data)
    } catch (error) {
      if (error.response && error.response.data) {
        return thunkAPI.rejectWithValue(error.response.data);
      }
      return thunkAPI.rejectWithValue("An unexpected error occurred");
    }
    
  }
);

const getUserInfoByUsername = createAsyncThunk(
  "auth/getUserInfoByUsername",
  async(username, thunkAPI) => {
    const response = clientServer.get("/user/get_profile", {
      params: {
        username: context.query.username,
      },
    });
    return thunkAPI.fulfillWithValue(response.data.profile);
  }
);

const updateUserProfile = createAsyncThunk(
  "auth/updateUserAndProfile",
  async(userData, thunkAPI) => {
    try {
      const response = await clientServer.patch("/profile", {
        token: localStorage.getItem("token"),
        bio: userData.bio,
        pastWork: userData.pastWork,
        education: userData.education,
        currentPostion: userData.currentPostion,
      });
      thunkAPI.dispatch(getAboutUser());
      return thunkAPI.fulfillWithValue(response.data.message);
    } catch (error) {
      if (error.response && error.response.data) {
        return thunkAPI.rejectWithValue(error.response.data);
      }
      return thunkAPI.rejectWithValue("An unexpected error occurred");
    }
    
  }
);


const updateUserData = createAsyncThunk(
  "auth/updateUserData",
  async(userData, thunkAPI) => {
    try {
      const response = await clientServer.patch("/update/info", {
        token: localStorage.getItem("token"),
        username: userData.username,
        email: userData.email,
        password: userData.password,
        name: userData.name,
        password: userData.password
      })
      thunkAPI.dispatch(getAboutUser());
      return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
      if (error.response && error.response.data) {
        return thunkAPI.rejectWithValue(error.response.data);
      }
      return thunkAPI.rejectWithValue("An unexpected error occurred");
    }
  }
);

export {
  loginUser,
  registerUser,
  getAboutUser,
  getAllProfiles,
  sendConnectionRequest,
  getConnectionRequests,
  getMyConnectionRequests,
  acceptConnection,
  getUserInfoByUsername,
  updateUserProfile,
  updateUserData,
};
