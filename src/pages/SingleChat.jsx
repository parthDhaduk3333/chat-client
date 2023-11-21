import React, { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import Actions from '../Actions'
import { findUser } from '../http'
import { initSocket } from '../socket'

const SingleChat = () => {
    const socketRef = useRef(null);
    const { id } = useParams()
    const { user } = useSelector(state => state.userDetails)
    const [currentUser, setCurrentUser] = useState("")
    useEffect(() => {
        const init = async () => {
            socketRef.current = await initSocket();
            socketRef.current.on('connect_error', err => handleError(err))
            socketRef.current.on('connect_failed', err => handleError(err))
            const handleError = (e) => {
                console.log('socket error', e.message);
                toast.error(e.message)
            }
            socketRef.current.on(Actions.MSG,(data) => {
                console.log(data)
            })
        }
        init()
    }, [currentUser])
    useEffect(() => {
        const getUser = async () => {
            const { data } = await findUser(id)
            if (data?.success) {
                setCurrentUser(data.user)
            } else {
                toast.error("something went wrong")
            }
        }
        getUser();
    }, [])
    
    const sendMessage = () => {
        socketRef.current.emit(Actions.MSG,{username:currentUser.name,msg:`Message from ${user.name}`})
    }
    return (
        <div>
            {/* <h1>{user.name}</h1>
            <h1>{currentUser.name}</h1>
            <button onClick={sendMessage}>Sent</button> */}
            <div className="container">
                <div className="row">
                    .col-lg-
                </div>
            </div>
        </div>
    )
}

export default SingleChat