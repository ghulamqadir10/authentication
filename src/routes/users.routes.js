import express from "express"
import { registerUser, loginUser, logoutUser, refreshToken, authenticateUser } from "../controllers/users.controllers.js";

const router = express.Router()

// router.post("/encryptPassword", encryptPassword)
router.post("/registerUser", registerUser)
router.post("/loginUser", loginUser)
router.post("/logoutUser", logoutUser)
router.post("/refreshToken", refreshToken)
// router.post("/authenticateUser", authenticateUser)


export default router;  