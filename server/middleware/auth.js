import User from "../models/User.js"
import jwt from "jsonwebtoken"

// middleware to protect routes that require authentication


export const protectRoute = async (req, res, next) => {
    try {
        const token = req.headers.token

        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        const user = await User.findById(decoded.id).select("-password")


        if(!user) {
            return res.status(401).json({ success: false, message: "user not found" })
        }
        req.user = user
        next()

    } catch (error) {
        res.status(401).json({ success: false, message: error.message })
    }
}


