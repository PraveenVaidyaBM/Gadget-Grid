import mongoose from "mongoose";

// MongoDB Connection Function
const connectDB = async () => {
    try{
        // Connect to MongoDB using the connection string from environment variables
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch(error){
        // Log any connection errors and exit the process
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
}

export default connectDB;