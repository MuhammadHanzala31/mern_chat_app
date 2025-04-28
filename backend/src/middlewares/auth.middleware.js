import { asyncHandler } from "../utils/asyncHanlder.js";
import { ApiError } from "../utils/apiError.js";
import jwt from 'jsonwebtoken'
import { User } from "../models/user.model.js";


export const verifyJWT = asyncHandler(async (req, _, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
        if (!token) {
            throw new ApiError(401, "unauthorize request")
        }
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        if (!decodedToken) {
            throw new ApiError(401, "Invalid Token")
        }

        const user = await User.findById(decodedToken._id).select("-password");
        if (!user) {

            throw new ApiError(401, "Invalid Access Token")
        }

        req.user = user
        next()
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token")
    }
})

