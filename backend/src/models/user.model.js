import mongoose from "mongoose";

const userScema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true,
    },
    clerkId: {
        type: String,
        required: true,
        unique: true,
    }
}, {timestamps: true}) // it creates fields {createdAt, updatedAt}

export const User = mongoose.model('User', userScema)

