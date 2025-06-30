import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        await mongoose.connect(
            'mongodb://augmedix:1234@ac-3jezllm-shard-00-00.nwaolhh.mongodb.net:27017,ac-3jezllm-shard-00-01.nwaolhh.mongodb.net:27017,ac-3jezllm-shard-00-02.nwaolhh.mongodb.net:27017/augmedix?ssl=true&replicaSet=atlas-nopsag-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0'
        );
        console.log("Database Connected Successfully");
    } catch (error) {
        console.error("Error connecting to database:", error);
    }
}
