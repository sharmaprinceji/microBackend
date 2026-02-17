import express from "express";
import { createProduct, deleteProduct, favorite, getProduct, getProducts, updateProduct } from "../controllers/productController.js";
import auth from "../middleware/authMiddleware.js";
const router =express.Router();



router.post("/", auth, createProduct);

router.get("/", getProducts);

router.get("/:id", getProduct);

router.put("/:id", auth, updateProduct)

router.post("/:id/favorite", auth, favorite);

router.delete("/:id", auth, deleteProduct);

export default router;
