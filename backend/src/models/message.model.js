import mongoose from "mongoose"

const messageSchema = new mongoose.Schema({
    senderId : {
        type : mongoose.Types.ObjectId,
        ref : "User",
        required : true
    },
    reciverId : {
        type : mongoose.Types.ObjectId,
        ref : "User",
        required : true
    },
    message : {
        type : String,
        index : true
    },
    image : {
        type : String
    }
},{timestamps : true})

export const Message = mongoose.model("Message", messageSchema)