import asyncHandler from "../middleware/asyncHandler.js";
import User from "../models/User.js";
import createError from "../utils/createError.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"

export const Register = asyncHandler(async (req, res, next) => {
    const { name, email, password } = req.body

    if (!name || !email || !password) throw createError("name, email and password are required", 400)

    const existingUser = await User.findOne({ email });
    if (existingUser) throw createError('User already exists', 400);

    const hashPassword = await bcrypt.hash(password, 10)

    const user = new User({
        name,
        email,
        password: hashPassword
    })
    await user.save()
    res.status(200).json({ message: 'User registered successfully', user })
})



export const Login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body

    if ( !email || !password) throw createError("email and password are required", 400)

    const user = await User.findOne({ email });
    if (!user) throw createError('User not found', 404);

    const isPasswordValid  = await bcrypt.compare(password, user.password)
    if (!isPasswordValid ) throw createError("Invalid password", 401)
    
    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1d" })

    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000,
    });

    res.cookie("user", JSON.stringify({
        id: user._id,
        email: user.email,
        name: user.name
    }), {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ message: 'User login successfully', user, token })
})


export const logout = asyncHandler( async (req, res ,next) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
    });
    res.clearCookie("user", {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
    });
    res.status(200).json({ message: "Logout successful" });
})