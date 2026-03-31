import React, { useEffect, useRef, useState } from 'react'
import assets from '../assets/assets'
import { formatMessageTime } from '../lib/utils';
import { useContext } from 'react';
import { ChatContext } from '../../context/ChatContext';
import { AuthContext } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const ChatContainer = ({ showRightSidebar, setShowRightSidebar, showLeftSidebar, setShowLeftSidebar }) => {

  const {authUser,onlineUsers} = useContext(AuthContext)
  const {selectedUser, messages, setSelectedUser, sendMessage, getMessages} = useContext(ChatContext)

  const scrollEnd = useRef();


  const [input, setInput] = useState("")


  //handle sending a message
  const handleSendMessage = async (e) => {
    e?.preventDefault();
    const messageText = input.replace(/\r\n/g, '\n')
    if (messageText.trim() === "") return null
    await sendMessage({ text: messageText })
    setInput("")
  };

  const handleComposerKeyDown = async (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      await handleSendMessage()
    }
  }




  //handle sending a image
  const handleSendImage = async (e) => {
    const file = e.target.files[0]
    if(!file || !file.type.startsWith('image/')){
      toast.error("Please select a valid image file")
      return;
    }

    const reader = new FileReader()
    reader.onloadend = async () => {
      await sendMessage({image: reader.result})
      e.target.value = ""
    }
    reader.readAsDataURL(file)
  }

  useEffect(() => {
    if(selectedUser){
      getMessages(selectedUser._id)
    }
  }, [selectedUser])



  useEffect(() => {
    if(scrollEnd.current && messages){
      scrollEnd.current.scrollIntoView({behavior:'smooth'})
    }
  }, [messages])

  return selectedUser ? ( 
    <div className='bg-[#818582]/10 h-full overflow-scroll relative backdrop-blur-lg'>
      <img
        onClick={() => setShowRightSidebar((prev) => !prev)}
        src={assets.arrow_icon}
        alt="Toggle sidebar"
        className={`cursor-pointer absolute top-3 right-3 z-10 w-7 transition-transform ${showRightSidebar ? 'rotate-180' : ''}`}
      />
      {/* header */}
      <div className='flex items-center gap-3 py-3 mx-4 border-b border-stone-500'>
        <img
          onClick={() => setShowLeftSidebar((prev) => !prev)}
          src={assets.arrow_icon}
          alt="Toggle users"
          className={` cursor-pointer md:hidden w-7  transition-transform ${showLeftSidebar ? '' : 'rotate-180'}`}
        />
        <img src={selectedUser.profilePic || assets.avatar_icon
        } alt="" className = 'w-8 h-8 aspect-square object-cover rounded-full shrink-0' />
        <p className = 'flex-1 text-lg text-white flex items-center gap-2'>
          {selectedUser.fullName}
          {onlineUsers.includes(selectedUser._id) && <span className='w-2 h-2 rounded-full bg-green-500'></span>}
        </p>
      </div>
      {/* chat area */}
      <div className='flex flex-col h-[calc(100%-120px)] overflow-y-scroll p-3'>
        {messages.map((msg,index) =>(
          <div key={index} className={`flex items-end gap-2 justify-end ${msg.senderId !== authUser._id && 'flex-row-reverse'}`}>
            {msg.image ? (
              <img src = {msg.image} alt = "" className='max-w-57.5 border border-gray-700 rounded-lg overflow-hidden mb-8'/>
            ) : (
              <p className={`p-2 max-w-50 md:text-sem font-light rounded-lg mb-8 whitespace-pre-wrap wrap-break-word bg-violet-500/20 text-white ${msg.senderId === authUser._id ? 'rounded-br-none' : 'rounded-bl-none'}`}>
                {msg.text}
              </p>
            )}

            <div className='text-center  text-xs'>
              <img src={msg.senderId === authUser._id ? authUser?.profilePic || assets.avatar_icon : selectedUser?.profilePic || assets.avatar_icon} alt="" className=' w-7 h-7 aspect-square object-cover rounded-full shrink-0'/>
              <p className='text-white/50 pt-1'>
                {formatMessageTime(msg.createdAt)}
              </p>
            </div>  
          </div>
        
        ))} 
        <div ref ={scrollEnd}></div>
      </div>
      
      {/* bottom area */}

      <div className='absolute bottom-0 left-0 right-0 flex items-center gap-3 p-3'>
        <div className='flex-1 flex items-center bg-gray-100/12 px-3 rounded-full'>
          <textarea
            onChange={(e) => setInput(e.target.value)}
            value={input}
            onKeyDown={handleComposerKeyDown}
            placeholder='Send a message'
            rows={1}
            className='flex-1 text-sm p-3 border-none rounded-lg outline-none text-white placeholder-gray-400 bg-transparent resize-none'
          />
          <input onChange={handleSendImage} type="file"  id = "image" accept="image/png, image/jpeg" hidden/>
          <label htmlFor="image">
            <img src={assets.gallery_icon} alt="" className='w-5 mr-2 cursor-pointer hover:ring-2 hover:ring-white rounded'/>
          </label>
        </div>

      <img onClick={handleSendMessage} src= {assets.send_button} alt="" className='w-9 cursor-pointer hover:ring-2 hover:ring-white rounded-full' />
      </div>

    </div>
  ) : (
    <div className='flex flex-col items-center justify-center gap-2 text-gray-500 bg-white/10 max-md:hidden'>
      <img src={assets.logo_icon} alt="" className = 'max-w-16' />
      <p className='text-lg font-medium text-white '>
        Chat Anytime, Anywhere
      </p>
    </div>
  )
}

export default ChatContainer