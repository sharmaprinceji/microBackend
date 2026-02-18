import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";

import {
  getProducts,
  getProduct,
  toggleFavorite,
  getFavoriteProducts
} from "../controllers/productController.js";

const router = express.Router();


// Correct order
router.get("/", getProducts);

router.get("/favorites", authMiddleware, getFavoriteProducts);

router.get("/:id", getProduct);

router.post("/:id/favorite", authMiddleware, toggleFavorite);

export default router;
