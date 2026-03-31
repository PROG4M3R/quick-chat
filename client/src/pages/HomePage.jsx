import React, { useContext, useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar'
import ChatContainer from '../components/ChatContainer'
import RightSidebar from '../components/RightSidebar'
import { ChatContext } from '../../context/ChatContext'

const HomePage = () => {

  const {selectedUser} = useContext(ChatContext)
  const [showRightSidebar, setShowRightSidebar] = useState(false)
  const [showLeftSidebar, setShowLeftSidebar] = useState(false)

  useEffect(() => {
    setShowRightSidebar(false)
    setShowLeftSidebar(false)
  }, [selectedUser?._id])

  return (
    <div className='border w-full h-screen sm:px-[15%] sm:py-[5%]'>
    <div className = {`backdrop-blur-xl border-2 border-gray-600 rounded-2xl overflow-hidden h-full grid grid-cols-1 relative ${selectedUser && showRightSidebar ? 'md:grid-cols-[1fr_1.5fr_1fr] xl:grid-cols-[1fr_2fr_1fr]' : 'md:grid-cols-[1fr_1.5fr]'}`}>
          <Sidebar showLeftSidebar={showLeftSidebar} />
          <ChatContainer
            showRightSidebar={showRightSidebar}
            setShowRightSidebar={setShowRightSidebar}
            showLeftSidebar={showLeftSidebar}
            setShowLeftSidebar={setShowLeftSidebar}
          />
      <RightSidebar showRightSidebar={showRightSidebar} /> 

        </div>
    </div>
  )
}

export default HomePage