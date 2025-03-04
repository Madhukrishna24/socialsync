import Profile from "../models/profile.model.js";
import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import PDFDocument from "pdfkit";
import fs from "fs";
import connectionRequest from "../models/connections.model.js";
import Post from "../models/posts.model.js";
import Comment from "../models/comments.model.js";
import { log } from "console";

const convertUserDataToPdf = async (userData) => {
  const doc = new PDFDocument({
    margins: { top: 50, bottom: 50, left: 50, right: 50 },
    size: "A4",
  });
  const outputPath = crypto.randomBytes(32).toString("hex") + ".pdf";
  const stream = fs.createWriteStream("uploads/" + outputPath);
  doc.pipe(stream);

  // Add a title with underline
  doc
    .fontSize(20)
    .font("Helvetica-Bold")
    .text("User Profile", { align: "center" })
    .moveDown(0.5)
    .underline(220, 40, 150, 1);

  // Correct the image placement with coordinates
  doc
    .image(`uploads/${userData.userId.profilePicture}`, {
      fit: [100, 100], // Adjust size to fit
      align: "center",
      valign: "center",
      x: 250, // Set X-coordinate for the image (centered for A4)
      y: 100, // Set Y-coordinate to place it appropriately under the title
    })
    .moveDown(1);

  // Move the cursor below the image to avoid overlap with text
  doc.moveDown(6);

  // User details section
  doc
    .fontSize(16)
    .font("Helvetica-Bold")
    .text("User Details", { underline: true })
    .moveDown(0.5);

  // Display user information
  doc.fontSize(12).font("Helvetica").text(`Name: ${userData.userId.name}`);
  doc.text(`Username: ${userData.userId.username}`);
  doc.text(`Email: ${userData.userId.email}`);
  doc.text(`Bio: ${userData.bio}`);
  doc.text(`Current Position: ${userData.currentPostion}`).moveDown(1);

  // Adding a separator
  doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke().moveDown(1);

  // Past Work section
  doc
    .fontSize(16)
    .font("Helvetica-Bold")
    .text("Past Work Experience", { underline: true })
    .moveDown(0.5);

  // Loop through past work experiences
  userData.pastWork.forEach((work, index) => {
    doc
      .fontSize(14)
      .font("Helvetica-Bold")
      .text(`${index + 1}. ${work.position}`, { continued: true });
    doc
      .fontSize(12)
      .font("Helvetica")
      .text(` (Company: ${work.comapny}, Years: ${work.years})`, {
        continued: false,
      });
    doc.moveDown(0.5);
  });

  // End the document and return the file path
  doc.end();
  return outputPath;
};

const register = async (req, res) => {
  try {
    const { email, name, username, password } = req.body;

    // Check if all fields are provided
    if (!email || !password || !username || !name) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if email or username already exists
    const userExist = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (userExist) {
      return res
        .status(400)
        .json({ message: "Username or Email already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const savedUser = new User({
      email,
      name,
      password: hashedPassword,
      username,
    });
    await savedUser.save();

    const profile = new Profile({ userId: savedUser._id });
    await profile.save();

    res
      .status(201)
      .json({ message: "Registration successful. Please log in." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res
        .status(400)
        .json({ message: "Please provide valid credentials" });
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User does not exist" });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = crypto.randomBytes(32).toString("hex");
    await User.updateOne({ _id: user._id }, { token });
    await user.save();
    return res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProfilePic = async (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(400).json({ message: "Invalid token" });
  try {
    const user = await User.findOne({ token: token });
    if (!user) return res.status(404).json({ message: "User not found" });
    user.profilePicture = req.file.filename;
    await user.save();
    res.status(201).json({ message: "User profile updated" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateUserProfile = async (req, res) => {
  const { token, ...userData } = req.body;
  if (!token) return res.status(400).json({ message: "Invalid token" });

  try {
    const user = await User.findOne({ token });
    if (!user) return res.status(404).json({ message: "User not found" });

    const { username, email } = userData;

    // Check if email already exists and belongs to another user
    if (email) {
      const existingEmailUser = await User.findOne({ email });
      if (
        existingEmailUser &&
        String(existingEmailUser._id) !== String(user._id)
      ) {
        return res.status(409).json({ message: "Email already exist" });
      }
    }

    // Check if username already exists and belongs to another user
    if (username) {
      const existingUsernameUser = await User.findOne({ username });
      if (
        existingUsernameUser &&
        String(existingUsernameUser._id) !== String(user._id)
      ) {
        return res.status(409).json({ message: "Username already exist" });
      }
    }

    // Only hash the password if provided
    if (userData.password) {
      userData.password = await bcrypt.hash(userData.password, 10);
    }

    // Update the user with the new data
    Object.assign(user, userData);
    await user.save();

    return res.status(201).json({ message: "User updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


const updateUserProfileData = async (req, res) => {
  const { token, ...profileData } = req.body;

  if (!token) return res.status(400).json({ message: "Invalid token" });

  try {
    const user = await User.findOne({ token });
    if (!user) return res.status(404).json({ message: "User not found" });
    const profile = await Profile.findOne({ userId: user._id });
    Object.assign(profile, profileData);
    await profile.save();

    return res
      .status(201)
      .json({ message: "User profile updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserData = async (req, res) => {
  const token = req.headers.authorization;

  if (!token) return res.status(400).json({ message: "Invalid token" });
  try {
    const user = await User.findOne({ token });
    if (!user) return res.status(404).json({ message: "User not found" });

    const userProfile = await Profile.findOne({ userId: user._id }).populate(
      "userId",
      "name email username profilePicture"
    );
    return res.status(200).json({ data: userProfile });
  } catch (error) {}
};

const getAllProfiles = async (req, res) => {
  // const { token } = req.body;
  // if (!token) return res.status(400).json({ message: "Invalid token" });
  try {
    const profiles = await Profile.find().populate(
      "userId",
      "name username email profilePicture"
    );
    return res.status(200).json({ profiles: profiles });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const downloadResume = async (req, res) => {
  const userId = req.query.id;

  const userProfile = await Profile.findOne({ userId }).populate(
    "userId",
    "name email username profilePicture"
  );

  const outputPath = await convertUserDataToPdf(userProfile);
  res.status(200).json({ message: outputPath });
};

const sendConnectionRequest = async (req, res) => {
  const { token, connectionId } = req.body;

  if (!token) return res.status(400).json({ message: "Invalid token" });

  try {
    const user = await User.findOne({ token });
    if (!user) return res.status(404).json({ message: "User not found" });

    const connectionUser = await User.findOne({ _id: connectionId });

    if (!connectionUser)
      return res.status(404).json({ message: "Connection user not found" });

    const existingConnection = await connectionRequest.findOne({
      userId: user._id,
      connectionId: connectionUser._id,
    });

    if (existingConnection)
      return res.status(400).json({ message: "Request already sent" });

    const request = new connectionRequest({
      userId: user._id,
      connectionId: connectionUser._id,
    });

    await request.save();
    return res.status(200).json({ message: "Request sent successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// User sent requests
const getMyConnectionsRequests = async (req, res) => {
  const token = req.query.token;
  if (!token) return res.status(400).json({ message: "Invalid token" });
  try {
    const user = await User.findOne({ token });
    if (!user) return res.status(404).json({ message: "User not found" });
    const connections = await connectionRequest
      .find({
        userId: user._id,
      })
      .populate("connectionId", "name username email profilePicture");
    return res.json({ requests: connections });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// user got requests
const getUserGotConnectionRequests = async (req, res) => {
  const token = req.query.token;
  if (!token) return res.status(400).json({ message: "Invalid token" });
  try {
    const user = await User.findOne({ token });
    if (!user) return res.status(404).json({ message: "User not found" });
    const connections = await connectionRequest
      .find({ connectionId: user._id })
      .populate("userId", "name username email profilePicture");

    return res.json(connections);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const acceptConnectionRequest = async (req, res) => {
  const { token, requestId, action_type } = req.body;


  if (!token) return res.status(400).json({ message: "Invalid token" });
  try {
    const user = await User.findOne({ token });
    if (!user) return res.status(404).json({ message: "User not found" });
    const connection = await connectionRequest.findOne({ _id: requestId });


    if (action_type === "accept") connection.status_accepted = true;
    else connection.status_accepted = false;

    await connection.save();
    return res.status(200).json({ message: "Connection Accepted" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getUserProfileData = async (req, res) => {
  const { username } = req.query;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: "User not found" });
    const userProfile = await Profile.findOne({ userId: user._id }).populate(
      "userId",
      "name username email profilePicture"
    );

    return res.status(200).json({ profile: userProfile });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
export {
  register,
  login,
  updateProfilePic,
  updateUserProfile,
  getUserData,
  updateUserProfileData,
  getAllProfiles,
  downloadResume,
  sendConnectionRequest,
  getUserGotConnectionRequests,
  acceptConnectionRequest,
  getMyConnectionsRequests,
  getUserProfileData,
};
