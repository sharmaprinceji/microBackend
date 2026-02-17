import mongoose from "mongoose";

const connectDB = async () => {
    try {
        //console.log("5======>",process.env.MONGODB_URI);
        await mongoose.connect(process.env.MONGODB_URI, {
            dbName: "marcoDb"
        });
        console.log("MongoDB Connected");
    } catch (error) {
        console.error("MongoDB Connection Error:", error.message);
        process.exit(1);
    }
};

export default connectDB;