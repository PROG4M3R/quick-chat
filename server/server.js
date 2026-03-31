import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv/config'
import http from 'http'
import { connectDB } from './lib/db.js'
import userRouter from './routes/userRoutes.js'
import messagesRouter from './routes/messagesRoutes.js'
import { Server } from 'socket.io'

//create express app and http server


const app = express()
const server = http.createServer(app)


//socket.io setup
export const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE"]
    }
})


//store online users 

export const userSocketMap = {} // userid : socketid

//socket.io connection handler

io.on("connection", (socket) => {
    
    const userId = socket.handshake.query.userId
    console.log("User connected: ", userId)


    if(userId) {
        userSocketMap[userId] = socket.id
        console.log("User online: ", userId)
    }


    //emit online users to all clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap))


    socket.on("disconnect", () => {
        console.log("User disconnected: ", socket.id)
            delete userSocketMap[userId]
            io.emit("getOnlineUsers", Object.keys(userSocketMap)) 
        }
    )
    }
)


//middlewares
app.use(cors())
app.use(express.json({limit: "4mb"}))


//routes
app.use('/api/status', (req, res) => {
    res.json({message: "Server is running"})
})
app.use('/api/auth', userRouter)
app.use('/api/messages', messagesRouter)


//connect to the database
await connectDB() 

const PORT = process.env.PORT || 5000

server.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on ${PORT}`)
})

//export server for vercel
export default server