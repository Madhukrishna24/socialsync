import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import postRoutes from "./routes/posts.routes.js"
import userRoutes from "./routes/user.routes.js"

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("uploads"))

app.use(postRoutes)
app.use(userRoutes);

const start = async () => {
    const url = process.env.MONGO_DB_URL
    const port = process.env.BACKEND_PORT || 5000
    await mongoose.connect(url)
    app.listen(port, () => console.log(`Server start at port: ${port}`))
}

start()