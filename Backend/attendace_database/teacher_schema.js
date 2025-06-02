import mongoose from "mongoose"

const teacherSchema = new mongoose.Schema({
    Name:{
        type:String,
        required:true,
    },
    Email:{
        type:String,
        required:true,
        unique:true
    },
    Department:{
        type:String,
        required:true
    }
})

export const Teacher = mongoose.model('Teacher',teacherSchema,'Teacher');

// import { Teacher } from "./models/attandace_database/teacher_schema.js" // use this to import