import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { fetchUsersForSidebar, getUserMessage, sendMessage } from "../controllers/message.controller.js";

const router = Router()

router.route('/send/:id').post(verifyJWT, upload.single("image"), sendMessage)
router.route('/user/:id').get(verifyJWT, getUserMessage)
router.route('/users').get(verifyJWT, fetchUsersForSidebar)



export default router