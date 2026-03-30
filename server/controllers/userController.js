import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils.js";

import cloudinary from "../lib/cloudinary.js"

//signup new user
export const signup = async (req, res) => {
    const { email, fullName, password, bio } = req.body
    try {

        if(!email || !fullName || !password || !bio) {
            return res.status(400).json({ message: "Missing details" });
        }

        const user = await User.findOne({ email })

        if(user) {
            return res.status(400).json({ message: "User already exists" })
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = await User.create({
            email,
            fullName,
            password : hashedPassword,
            bio
        })
        const token = generateToken(newUser._id)
        res.status(201).json({ success: true, user: newUser, token, message: "User created successfully" })


    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

//login user
export const login = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ email })

        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid email or password" })
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password)
        if(!user || !isPasswordCorrect) {
            return res.status(400).json({ success: false, message: "Invalid email or password" })
        }
        const token = generateToken(user._id)
        res.status(200).json({ success: true, user, token, message: "Login successful" })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}


//controller to check if the user is authenticated

export const checkAuth = async (req, res) => {
    res.json({ success: true, user: req.user, })
}



//controller to update user profile
export const updateProfile = async (req, res) => {
    try {
        const {profilePic, bio, fullName} = req.body

        const userId = req.user._id;

        let updatedUser ;


        if(!profilePic) {
            updatedUser = await User.findByIdAndUpdate(userId, { bio, fullName }, { new: true })

        } else {

            const upload = await cloudinary.uploader.upload(profilePic, {
                folder: "profile_pics"
            })
            updatedUser = await User.findByIdAndUpdate(userId, { profilePic: upload.secure_url, bio, fullName })
        }

        res.json({ success: true, user: updatedUser, message: "Profile updated successfully" })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}