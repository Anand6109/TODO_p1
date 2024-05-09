import mongoose from "mongoose";

export const connectDB = () => {
    mongoose.connect(process.env.MONGO_URI,{dbName : "NODEAPI"})
        .then((c) => console.log(`MongoDB connected with ${c.connection.host}`))
        .catch(err => console.error('MongoDB connection error:', err))
}
