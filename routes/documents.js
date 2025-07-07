import express from "express";
import path from "path";
import fs from "fs";

const router = express.Router();

router.get("/download/:filename", (req, res) => {
  const filePath = path.join("uploads", req.params.filename);
  if (fs.existsSync(filePath)) {
    res.download(filePath);
  } else {
    res.status(404).json({ message: "File not found" });
  }
});

export default router;
