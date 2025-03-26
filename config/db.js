import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://augmedix:1234@cluster0.7g8mk.mongodb.net/augmedix');
        console.log("Database Connected Successfully");
    } catch (error) {
        console.error("Error connecting to database:", error);
    }
}
