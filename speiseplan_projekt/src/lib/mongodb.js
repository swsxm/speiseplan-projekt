import mongoose from "mongoose";

export const connectMongoDB = async () => {
    // Connect to MongoDB
    try {
        console.log(process.env.MONGODB_URI)
        await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true });
        console.log("Connected to MongoDB");
    }
    catch (error) {
        console.log('error connecting to mongodb', error);
    }
}