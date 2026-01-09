import mongoose from 'mongoose'

export const connectDB = async () => {
    try {
       const conn = await mongoose.connect(process.env.MONGODB_URI)
       console.log(`Conntectd to mongoDb ${conn.connection.host}`);
    } catch (error) {
        console.log(error);
        process.exit(1)
        
    }
}