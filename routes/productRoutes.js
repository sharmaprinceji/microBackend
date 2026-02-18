import express from "express";
import upload from "../middleware/uploadMiddleware.js";

import {
    createProduct,
    getProducts,
    getProduct,
    updateProduct,
    deleteProduct,
    toggleFavorite,
    getFavoriteProducts
} from "../controllers/productController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getProducts);

router.get("/favorites", authMiddleware, getFavoriteProducts);

router.get("/:id", getProduct);

router.post(
    "/",
    authMiddleware,
    upload.single("image"),
    createProduct
);


router.put(
    "/:id",
    authMiddleware,
    upload.single("image"),
    updateProduct
);

router.delete("/:id", authMiddleware, deleteProduct);

router.post("/:id/favorite", authMiddleware, toggleFavorite);

export default router;
