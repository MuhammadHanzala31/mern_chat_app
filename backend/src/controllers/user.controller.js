import { asyncHandler } from "../utils/asyncHanlder.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResonse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";


const generateAccessToken = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
         return accessToken
    } catch (error) {
        throw new ApiError(500, "something went wrong while create access Token")
    }
}

const signupUser = asyncHandler(async (req, res) => {
    const {fullname, email, password} = req.body;
    if([fullname, email, password].some(e=>e?.trim() === "")){
        throw new ApiError(404, "all feilds are required")
    }

    const emailExist = await User.findOne({email})


    if(emailExist){
        throw new ApiError(401, "user with this email already exist try another email")
    }

    const avatarLocalPath = req.file?.path

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    

    const user = await User.create({
        email,
        fullname,
        password,
        avatar : avatar?.url || ""
    })


    if(!user){
        throw new ApiError(500, "something went wromg while creating user")
    }
    const registerUser = await User.findById(user._id).select("-password");

    return res.status(201)
    .json(new ApiResponse(200, registerUser, "user created successfully"))
})

const loginUser = asyncHandler(async (req, res) => {
    const {email, password} = req.body

    if(!email || !password){
        throw new ApiError(404, "all feilds are required")
    }
    const user = await User.findOne({email})
     
    if(!user){
        throw new ApiError(404, "User is not found with this Email")
    }

    const checkPassword = await user.isPasswordCorrect(password);

    if(!checkPassword){
        throw new ApiError(401, "invalid Password")
    }
    
    const accessToken = await generateAccessToken(user._id)

    const loggedInUser = await User.findById(user._id).select("-password")
    const option = {
        httpOnly : true,
        secure : true
    }

    return res.status(201)
    .cookie("accessToken", accessToken, option)
    .json(new ApiResponse(200, {
        accessToken,loggedInUser
    }, "user is logged in successfully"))
})

const changeAvatar = asyncHandler(async (req, res) => {
    const userId = req.user._id
    const avatarLocal = req.file?.path
    console.log("avatarLocal",avatarLocal);
    
    if(!avatarLocal){
        throw new ApiError(404, "please upload avatar")
    }
    const avatar = await uploadOnCloudinary(avatarLocal)
    const changes = await User.findByIdAndUpdate(
        userId,
        {
            $set : {
                avatar : avatar?.url
            }
        },
        {
            new : true
        }
    )

    if(!changes){
        throw new ApiError(500, "something went wrong while changing the avatar")
    }
    return res.status(201)
    .json(new ApiResponse(200, changes, "avatar changed successfully"))

})

const logoutUser = asyncHandler(async (req, res) => {
    const option = {
        httpOnly : true,
        secure : true
    }

    return res.status(201)
    .clearCookie("accessToken", option)
    .json(new ApiResponse(200, {}, "user logout successfully"))
})

const checkUser = asyncHandler(async (req, res) => {
    const user = req.user;
    if(!user){
        throw new ApiError(404, "user is not found")
    }

    return res.status(201)
    .json(new ApiResponse(200, user, "user is aunthenticated"))
})



export {signupUser, loginUser, logoutUser, checkUser, changeAvatar}