import mongoose from "mongoose"

const studentSchema = new mongoose.Schema({
    RollNo:{
        type:String,
        required:true,
        unique:true
    },
    Name:{
        type:String,
        required:true
    },
    Email:{
        type:String,
        required:true,
        unique:true
    },
    ClassId:{
        type:mongoose.Schema.Types.ObjectId,
         ref:'Class',
        required:true
    }
});

export const Student = mongoose.model('Student',studentSchema,'Student');

// import { Student } from "./models/attandace_database/student_schema.js" // use this to import