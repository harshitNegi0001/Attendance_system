import mongoose from "mongoose"

const checkIdSchema =new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
})

export const checkId = mongoose.model('checkId', checkIdSchema, 'checkId');

// import { Student } from "./models/attandace_database/checkId_schema.js" // use this to import