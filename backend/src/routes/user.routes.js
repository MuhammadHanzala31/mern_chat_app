import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { changeAvatar, checkUser, loginUser, logoutUser, signupUser } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.route('/register').post(upload.single("avatar"), signupUser);
router.route('/login').post(loginUser)
// protected Routes
router.route('/logout').post(verifyJWT, logoutUser)
router.route('/check').get(verifyJWT, checkUser)
router.route('/update-avatar').patch(verifyJWT, upload.single("avatar"), changeAvatar)



export default router

