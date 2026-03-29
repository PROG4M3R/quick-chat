import express from 'express'
import { login, signup } from '../controllers/userController.js'
import { checkAuth, protectRoute } from '../middleware/auth.js'


const userRouter = express.Router()

userRouter.post("/signup", signup)
userRouter.post("/login", login)
userRouter.put("/update-profile", protectRoute)
userRouter.get("/check-auth", protectRoute, checkAuth)

export default userRouter