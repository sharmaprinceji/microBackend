import Product from "../models/Product.js";
import User from "../models/User.js"
import cloudinary from "../config/cloudinary.js";

export const createProduct = async (req, res) => {

  try {

    let imageUrl = "";

    // CASE 1: file uploaded
    if (req.file) {

      const result =
        await cloudinary.uploader.upload(

          `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`,

          {
            folder: "micro-marketplace"
          }

        );

      imageUrl = result.secure_url;
    }

    // CASE 2: image URL provided
    else if (req.body.image) {

      imageUrl = req.body.image;
    }

    else {

      return res.status(400).json({
        message: "Image required"
      });
    }


    const product =
      await Product.create({

        title: req.body.title,

        price: req.body.price,

        description: req.body.description,

        image: imageUrl

      });


    res.status(201).json({

      success: true,

      data: product

    });

  } catch (error) {

    res.status(500).json({

      message: error.message

    });

  }

};

export const getProducts = async (req, res) => {

  try {

    const page =
      Number(req.query.page) || 1;

    const limit =
      Number(req.query.limit) || 8;

    const search =
      req.query.search || "";

    const skip =
      (page - 1) * limit;


    // SEARCH LOGIC (title + price prefix)
    const query = {

      $or: [

        {
          title: {
            $regex: search,
            $options: "i"
          }
        },

        {
          description: {
            $regex: search,
            $options: "i"
          }
        },

        // PRICE PREFIX SEARCH
        {
          $expr: {
            $regexMatch: {
              input: {
                $toString: "$price"
              },
              regex: `^${search}`
            }
          }
        }

      ]

    };


    const products =
      await Product.find(
        search ? query : {}
      )
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });


    const total =
      await Product.countDocuments(
        search ? query : {}
      );


    res.json({

      success: true,

      data: products,

      page,

      pages:
        Math.ceil(total / limit),

      total

    });

  } catch (error) {

    res.status(500).json({

      message: error.message

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

    const product =
      await Product.findById(
        req.params.id
      );

    if (!product)
      return res
        .status(404)
        .json({
          message:
            "Product not found"
        });

    let imageUrl =
      product.image;


    // file upload
    if (req.file) {

      const result =
        await cloudinary.uploader.upload(

          `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`

        );

      imageUrl =
        result.secure_url;

    }

    // URL update
    else if (
      req.body.image
    ) {

      imageUrl =
        req.body.image;

    }


    product.title =
      req.body.title ||
      product.title;

    product.price =
      req.body.price ||
      product.price;

    product.description =
      req.body.description ||
      product.description;

    product.image =
      imageUrl;


    await product.save();


    res.json({

      success: true,

      data: product

    });

  }

  catch (error) {

    res.status(500).json({

      message:
        error.message

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

