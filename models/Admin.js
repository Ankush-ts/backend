import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        minlength: 6,
        required: true,
    },
    addedMovies: [
        {
            type: String,
        },
    ]
});

export default mongoose.model("Admin", adminSchema);