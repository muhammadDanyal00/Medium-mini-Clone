import express from "express";
import {
  createArticle,
  // getArticles,
  getArticleById,
  updateArticle,
  deleteArticle,
} from "../controllers/articleController.js";
// import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

// Create Article
router.post("/create", createArticle);

// Get Articles with Pagination
// router.get("/getarticles", getArticles);

// Get Single Article by ID
router.get("/getById/:id", getArticleById);

// // Update Article
router.put("/updatearticle/:id", updateArticle);

// Delete Article
router.delete("/deletearticles/:id", deleteArticle);

export default router;
