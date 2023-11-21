import React, { useEffect, useState } from 'react'
import Avatar from 'react-avatar'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'
import Actions from '../Actions'
import { findUser, getmessages } from '../http'

const ChatArea = ({ user, socketRef }) => {
    const loginData = useSelector(state => state.userDetails)
    const loginUser = loginData.user
    const [text, setText] = useState("")
    const [chats, setChats] = useState([])
    const [mount, setMount] = useState(1)
    const [typing, setTyping] = useState(false)
    const [ruser, setRuser] = useState("")
    const type = (e) => {
        if (e.key == "Enter") {
            sendMessage()
        }
    }
    const sendMessage = () => {
        const details = { recevierId: user._id, text, senderId: loginUser._id }
        socketRef.current.emit(Actions.MSG, details)
        setMount(3)
        setTyping(false)
        setText("")
    }
    const typeuser = async (value) => {
        setText(value)
        // socketRef.current.emit(Actions.TYPE,{senderId: loginUser._id,recevierId:user._id})
    }
    const createTime = (time) => {
        const createHour = new Date(time).getHours();
        const createMinutes = new Date(time).getMinutes();
        return `${createHour}:${createMinutes}`
    }
    useEffect(() => {
        if (socketRef.current) {
            socketRef.current.on(Actions.MSG, (data) => {
                toast.success(data[data.length-1].text)
                setMount(2)
            })
            socketRef.current.on(Actions.JOINED, () => {
                setMount(1)
            })
            // socketRef.current.on(Actions.TYPE,(data) => {
            //     toast.success("Typing...")
            // })
        }
    }, [socketRef.current])
    useEffect(() => {
        const msgs = async () => {
            const { data } = await getmessages({ senderId: loginUser._id, recevierId: user._id })
            // console.log(data)
            console.log(socketRef.current.id)
            setChats(data.messages)
            const chatWrapper = document.getElementById('chats')
            chatWrapper.scrollTop = chatWrapper.scrollHeight
        }
        msgs()
    }, [user, mount])
    return (
        <>
            <div className="margin">
                <div className="card name-feild px-3">
                    <div className="d-flex align-items-center">
                        <div>
                            <Avatar name={user.name} size="50" textSizeRatio="3" className='rounded-circle fw-bold' />
                        </div>
                        <div>
                            <h4 className='ms-3 mb-0 fw-bolder'>{user.name}</h4>
                            {user.online ? <p className="mb-0 fw-bold text-success ms-3">online</p> : <p className="mb-0 fw-bold text-muted ms-3">Offline</p>}
                        </div>
                    </div>
                </div>
            </div>
            <div className="card msg-field d-flex flex-column p-3 chat-wrapper">
                <div className="chats" id='chats'>
                    {
                        chats.map((chat, index) => {
                            if (chat.senderId == user._id && chat.recevierId == loginUser._id) {
                                return (
                                    <>
                                        <div className="d-flex">
                                            <p className="mb-0 ms-2 fw-bold">{user.name}</p>
                                        </div>
                                        <div className="message" key={index}>
                                            {chat.text}
                                        </div>
                                        <div className="d-flex mr">
                                            <p className="mb-0 ms-2">{createTime(chat.createdAt)}</p>
                                        </div>
                                    </>
                                )
                            } else if (chat.senderId == loginUser._id && chat.recevierId == user._id) {
                                return (
                                    <>
                                        <div className="d-flex mr">
                                            <p className="ms-auto mb-0 me-2 fw-bold">Me</p>
                                        </div>
                                        <div className="message my mr" key={index}>
                                            {chat.text}
                                        </div>
                                        <div className="d-flex mr">
                                            <p className="ms-auto mb-0 me-2">{createTime(chat.createdAt)}</p>
                                        </div>
                                    </>
                                )
                            }
                        })
                    }
                </div>
                <div className="text">
                {/* {chosenEmoji.emoji} */}
                    <input type="text" value={text} onChange={e => typeuser(e.target.value)} className='input-box' onKeyDown={e => type(e)} />
                    {/* <Picker onEmojiClick={onEmojiClick} /> */}
                </div>
            </div>
        </>
    )
}

export default ChatArea