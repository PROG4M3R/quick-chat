import User from "../models/User.js"
import Message from "../models/Message.js"
import cloudinary from "../lib/cloudinary.js"
import { io, userSocketMap } from "../server.js"



//get all users except the logged in user


export const getUsersForSidebar = async (req, res) => {
    try {
        const usersId = req.user._id
        const filteredUsers = await User.find({ _id: { $ne: usersId } }).select("-password")

        //count numer of unread messages for each user
        const unseenMessages = {}
        const promises = filteredUsers.map(async (users)=> {
            const messages = await Message.find({ sender: users._id, receiver: usersId, seen: false })
            if(messages.length > 0) {
                unseenMessages[users._id] = messages.length
            }
        })
        await Promise.all(promises)
        res.json({ success: true, users: filteredUsers, unseenMessages })
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message })
    }
}


//get all messages for selected user


export const getMessages = async (req, res) => {
    try {
        const myId = req.user._id
        const { id: selectedUserId } = req.params



        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: selectedUserId },
                { senderId: selectedUserId, receiverId: myId }
            ]
        })

        await Message.updateMany({ senderId: selectedUserId, receiverId: myId}, { seen: true })

        res.json({ success: true, messages })
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message })
    }
}

// api to mark message as seen using message id

export const markMessageAsSeen = async (req, res) => {
    try {
        const { id } = req.params
        
        await Message.findByIdAndUpdate(id, { seen: true })

        res.json({ success: true})
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message })
    }
}


//send message to selected user

export const sendMessage = async (req, res) => {
    try {
        const senderId = req.user._id
        const receiverId  = req.params.id
        const { text, image } = req.body

        let imageUrl;
        if(image) {
            const uploadResponse = await cloudinary.uploader.upload(image)
            imageUrl = uploadResponse.secure_url
        }
        
        const newMessage = await Message.create({
            senderId,
            receiverId,
            text,
            image: imageUrl
        })
        


        // Emit the new message to the receiver
        const receiverSocketId = userSocketMap[receiverId]
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage)
        }



        res.status(201).json({ success: true, message: newMessage, message: "Message sent successfully" })
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message })
    }
}