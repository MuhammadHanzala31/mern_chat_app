import { asyncHandler } from "../utils/asyncHanlder.js";
import { Message } from "../models/message.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResonse.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import {getReceiverSocketId, io} from '../index.js'

const fetchUsersForSidebar = asyncHandler(async (req, res) => {
    const myId = req.user?._id

    const filterUser = await User.find({ _id: { $ne: myId } }).select("-password")
    if (!filterUser) {
        throw new ApiError(409, "Error in fetching users for sidebar")
    }

    return res.status(201)
        .json(new ApiResponse(200, filterUser, "filter user fetched successfully"))

})


const getUserMessage = asyncHandler(async (req, res) => {
    const { id: userToChat } = req.params;
    const myId = req.user._id;
    const messages = await Message.find({
        $or: [
            { senderId: myId, reciverId: userToChat },
            { senderId: userToChat, reciverId: myId },
        ]
    })

    
    if (!messages) {
        throw new ApiError(409, "error in finding messages")
    }
    return res.status(201)
        .json(new ApiResponse(200, messages, "messages fetched successfully"))
})

const sendMessage = asyncHandler(async (req, res) => {
    const { text } = req.body;
    const { id : reciverId } = req.params;
    const senderId = req.user._id;
    const imagePath = req.file?.path;

    
    if (!reciverId) {
        throw new ApiError(404, "reciverId required")
    }
    
    const image = await uploadOnCloudinary(imagePath);
    console.log("image",image?.url)

    const message = await Message.create({
        senderId,
        reciverId,
        image: image?.url || "",
        message: text
    })
    // socket functionality is pending
    const reciveSocketId = getReceiverSocketId(reciverId)
    console.log(reciveSocketId,"reciveSocketId")
    if(reciveSocketId){
        io.to(reciveSocketId).emit("newMessage", message)
    }

    return res.status(201)
        .json(new ApiResponse(200, message, "message has been sent successfully"))
})

export { sendMessage, fetchUsersForSidebar, getUserMessage }