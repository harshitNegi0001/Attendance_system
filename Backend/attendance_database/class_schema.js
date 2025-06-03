import mongoose from "mongoose";
const classSchema = new mongoose.Schema({
    
    ClassName:{
        type:String,
        required:true,
        unique:true
    }
})

export const Class = mongoose.model('Class',classSchema,'Class');