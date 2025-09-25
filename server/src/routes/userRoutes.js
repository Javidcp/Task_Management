import express from "express";
import { Login, logout, Register } from "../controllers/userController.js";

const router = express.Router()


router.post('/register', Register);
router.post('/login', Login);
router.post('/logout', logout)

export default router
