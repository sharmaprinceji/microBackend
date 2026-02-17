import Product from "../models/Product.js";
import User from "../models/User.js";



/*
CREATE PRODUCT
POST /products
*/
export const createProduct = async (req, res) => {
    try {

        const { title, price, description, image } = req.body;

        if (!title || !price || !description || !image) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const product = await Product.create({
            title,
            price,
            description,
            image
        });

        return res.status(201).json({
            success: true,
            message: "Product created successfully",
            data: product
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: "Failed to create product",
            error: error.message
        });

    }
};



/*
GET ALL PRODUCTS (Search + Pagination)
GET /products?search=&page=&limit=
*/
export const getProducts = async (req, res) => {

    try {

        const page = Math.max(parseInt(req.query.page) || 1, 1);
        const limit = Math.max(parseInt(req.query.limit) || 5, 1);
        const search = req.query.search?.trim() || "";

        const query = {
            title: { $regex: search, $options: "i" }
        };

        const [products, total] = await Promise.all([

            Product.find(query)
                .skip((page - 1) * limit)
                .limit(limit)
                .sort({ createdAt: -1 })
                .lean(),

            Product.countDocuments(query)

        ]);

        return res.status(200).json({
            success: true,
            total,
            page,
            pages: Math.ceil(total / limit),
            data: products
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: "Failed to fetch products",
            error: error.message
        });

    }
};



/*
GET SINGLE PRODUCT
GET /products/:id
*/
export const getProduct = async (req, res) => {

    try {

        const product = await Product.findById(req.params.id).lean();

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: product
        });

    } catch (error) {

        return res.status(400).json({
            success: false,
            message: "Invalid product ID",
            error: error.message
        });

    }
};



/*
UPDATE PRODUCT
PUT /products/:id
*/
export const updateProduct = async (req, res) => {

    try {

        const productId = req.params.id;

        const updateFields = {};

        const allowedFields = ["title", "price", "description", "image"];

        for (const field of allowedFields) {
            if (req.body[field] !== undefined) {
                updateFields[field] = req.body[field];
            }
        }

        if (Object.keys(updateFields).length === 0) {
            return res.status(400).json({
                success: false,
                message: "No valid fields provided"
            });
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            productId,
            updateFields,
            {
                new: true,
                runValidators: true
            }
        ).lean();

        if (!updatedProduct) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Product updated successfully",
            data: updatedProduct
        });

    } catch (error) {

        return res.status(400).json({
            success: false,
            message: "Invalid product ID",
            error: error.message
        });

    }
};



/*
DELETE PRODUCT
DELETE /products/:id
*/
export const deleteProduct = async (req, res) => {

    try {

        const deleted = await Product.findByIdAndDelete(req.params.id);

        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Product deleted successfully"
        });

    } catch (error) {

        return res.status(400).json({
            success: false,
            message: "Invalid product ID"
        });

    }
};



/*
TOGGLE FAVORITE
POST /products/:id/favorite
*/
export const favorite = async (req, res) => {

    try {

        const userId = req.user;
        const productId = req.params.id;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const isFavorite = user.favorites.includes(productId);

        await User.updateOne(
            { _id: userId },
            isFavorite
                ? { $pull: { favorites: productId } }
                : { $addToSet: { favorites: productId } }
        );

        return res.status(200).json({
            success: true,
            message: isFavorite
                ? "Removed from favorites"
                : "Added to favorites"
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: "Favorite operation failed",
            error: error.message
        });

    }
};
