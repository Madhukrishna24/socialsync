import { Router } from "express";
import {
  getAllProfiles,
  getUserData,
  login,
  register,
  updateProfilePic,
  updateUserProfile,
  updateUserProfileData,
  downloadResume,
  sendConnectionRequest,
  getMyConnectionsRequests,
  getUserGotConnectionRequests,
  acceptConnectionRequest,
  getUserProfileData,
} from "../controllers/user.controller.js";
import multer from "multer";

const routers = Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

routers.route("/register").post(register);
routers.route("/login").post(login);
routers
  .route("/update/profile_pic")
  .post(upload.single("picture"), updateProfilePic);

routers.route("/update/info").patch(updateUserProfile);
routers.route("/user").get(getUserData);
routers.route("/profile").patch(updateUserProfileData);
routers.route("/profiles").get(getAllProfiles);
routers.route("/download/profile").get(downloadResume);


routers.route("/user/send_connection_request").post(sendConnectionRequest);
routers.route("/user/get_connection_request").get(getMyConnectionsRequests);
routers.route("/user/user_connection_request").get(getUserGotConnectionRequests);
routers.route("/user/accept_connection_request").post(acceptConnectionRequest);
routers.route("/user/get_profile").get(getUserProfileData);
export default routers;
