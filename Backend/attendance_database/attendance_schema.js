import mongoose from "mongoose"

const attendanceSchema = new mongoose.Schema({
    StudentId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Student',
        required:true
    },
    Date:{
        type:Date,
        required:true
    },
    SubjectId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Subject',
        required:true
    },
    AttendanceStatus:{
        type:String,
        required:true,
        enum:['present','absent']
    }

})

export const Attendance = mongoose.model('Attendance',attendanceSchema,'Attendance');

// import { Student } from "./models/attandace_database/attendance_schema.js" // use this to import