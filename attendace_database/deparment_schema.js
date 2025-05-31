import mongoose from "mongoose"

const departmentSchema =new mongoose.Schema({
    DepartmentName:{
        type:String,
        required:true
    }
})

export const Department = mongoose.model('Department',departmentSchema,'Department');

// import { Student } from "./models/attandace_database/student_schema.js" // use this to import