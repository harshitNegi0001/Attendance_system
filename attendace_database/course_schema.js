import mongoose from "mongoose"

const courseSchema =new mongoose.Schema({
    CourseName:{
        type:String,
        required:true
    },
    CourseCode:{
        type:String,
        required:true,
        unique:true
    }
})

export const Course = mongoose.model('Course',courseSchema,'Course');

// import { Student } from "./models/attandace_database/student_schema.js" // use this to import