import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import path from "path";

const app = express();

import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: "dbgoygd2h",
  api_key: "814559153155813",
  api_secret: "biRFToMgyXxl8NXiiUAK4K7orts",
});

mongoose.connect ("mongodb+srv://yashtrivedi1020stp:2yRXysoZXRo73RTr@cluster0.xh9ogcw.mongodb.net/", {dbName: "Node_js_mastery_course"}).then(()=> console.log("Mongo db connected")).catch((err)=> console.log(err)) 



// rendering ejs file
app.get("/", (req, res) => {
  res.render("index.ejs", { url: null });
});

const storage = multer.diskStorage({
  destination: "./public/uploads",
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

const upload = multer({ storage: storage });

const imageSchema = new mongoose.Schema({
  filename: String,
  public_id: String,
  imgUrl: String,
});

const File = mongoose.model("cloudinary", imageSchema);

app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const filePath = req.file.path;

    const cloudinaryRes = await cloudinary.uploader.upload(filePath, {
      folder: "NodeJS_Mastery_Course",
    });

    // Save to database with correct filename
    const db = await File.create({
      filename: req.file.originalname,
      public_id: cloudinaryRes.public_id,
      imgUrl: cloudinaryRes.secure_url,
    });

    res.render("index.ejs", { url: cloudinaryRes.secure_url });
  } catch (error) {
    console.error(error);
    res.status(500).send("Upload failed");
  }
});

const port = 3000;
app.listen(port, () => console.log(`server is running on port ${port}`));