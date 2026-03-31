import assets from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { useContext, useRef, useState } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { ChatContext } from '../../context/ChatContext'
import { useEffect } from 'react'


const Sidebar = ({ showLeftSidebar }) => {

    const {logout, onlineUsers} = useContext(AuthContext)

    const {getUsers, users, selectedUser, setSelectedUser, unseenMessages, setUnseenMessages} = useContext(ChatContext)


    const [input, setInput] = useState('')
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const menuRef = useRef(null)


    const  navigate = useNavigate();

    const filteredUsers = input ? users.filter(user => user.fullName.toLowerCase().includes(input.toLowerCase())) : users

    useEffect(() => {
        getUsers()
    }, [onlineUsers])

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleMenuAction = (callback) => {
        setIsMenuOpen(false)
        callback()
    }



  return (
    <div className={`bg-[#818582]/10 h-full p-5 rounded-r-xl overflow-y-scroll text-white ${selectedUser && !showLeftSidebar ? "max-md:hidden" : ''}`}>
        <div className = 'pb-5'>
            <div className = 'flex justify-between items-center'>
                <img src = {assets.logo} alt = "Logo"  className = 'max-w-40'/>
                <div ref={menuRef} className = 'relative '>
                    <button
                        type='button'
                        onClick={() => setIsMenuOpen((prev) => !prev)}
                        className='rounded-full p-2 hover:bg-white/15 transition-colors duration-200 cursor-pointer'
                    >
                        <img src = {assets.menu_icon} alt = "Menu" className = 'max-h-5'/>
                    </button>
                    <div className = {`absolute top-full right-0 z-20 w-32 p-3 rounded-md bg-[#282142] border border-gray-600 text-gray-100 text-center ${isMenuOpen ? 'block' : 'hidden'}`}>

                        <p onClick={() => handleMenuAction(() => navigate('/profile'))} className='cursor-pointer text-sm'>Edit Profile</p>
                        <hr className = 'my-2 border-t border-gray-500 '/>
                        <p onClick={() => handleMenuAction(logout)} className='cursor-pointer text-sm'>Logout</p>
                    </div>

                </div>

            </div>
            <div className='bg-[#282142] rounded-full flex items-center gap-2 py-3 px-4 mt-5'>
                <img src={assets.search_icon} alt="search" className = 'w-3' />
                <input onChange={(e) => setInput(e.target.value)} type="text" className = 'bg-transparent border-none outline-none text-white text-xs placeholder-[#c8c8c8] flex-1' placeholder = 'Search User'/>

            </div>

        </div>
        <div className = 'flex flex-col'>
            {filteredUsers.map((user,index) => (
                <div onClick={
                    () => {
                        setSelectedUser(user);
                        setUnseenMessages(
                            prev => (
                                {...prev, [user._id]: 0}
                            )
                        )
                    }
                }
                 key={index}
                  className = {`relative flex items-center gap-2 p-2 pl-2 rounded cursor-pointer max-sm:text-sm ${selectedUser?._id===user._id && 'bg-[#282142]/50'}`}>

                    <img src={user?.profilePic || assets.avatar_icon} className = 'w-8.75 aspect-square rounded-full' />
                    <div className='flex flex-col leading-5'>

                        <p>{user.fullName}</p>
                        {
                            onlineUsers.includes(user._id)
                            ? <span className='text-green-400 text-xs'>Online</span>
                            : <span className='text-neutral-400 text-xs'>Offline</span>
                        }
                    </div>
                    {Number(unseenMessages[user._id]) > 0 && (
                        <p className = 'absolute top-4 right-4 text-xs h-5 w-5 flex justify-center items-center rounded-full bg-slate-950 '>
                            {unseenMessages[user._id]}
                        </p>
                    )}
                </div>
            ))}

        </div>
    </div>
  )
}

export default Sidebar