import mongoose from "mongoose";
const subjectSchema = new mongoose.Schema({
    
    SubjectName:{
        type:String,
        required:true
    },
    ClassID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Class',
        required:true
    }

})

export const Subject = mongoose.model('Subject',subjectSchema,'Subject');