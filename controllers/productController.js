import Product from "../models/Product.js";
import User from "../models/User.js"

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


export const getProducts = async (req, res) => {

    try {

        const page = Math.max(parseInt(req.query.page) || 1, 1);
        const limit = Math.max(parseInt(req.query.limit) || 10, 1);
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


export const toggleFavorite = async (req, res) => {

  try {

    const user = await User.findById(req.user);

    const productId = req.params.id;

    const isFavorite =
      user.favorites.includes(productId);

    if (isFavorite) {

      user.favorites.pull(productId);

    } else {

      user.favorites.push(productId);
    }

    await user.save();

    res.status(200).json({

      success: true,

      isFavorite: !isFavorite

    });

  } catch {

    res.status(500).json({
      message: "Favorite failed"
    });
  }
};


export const getFavoriteProducts = async (req, res) => {

  try {

    const user = await User.findById(req.user)
      .populate("favorites");

    res.status(200).json({
      success: true,
      data: user.favorites
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

