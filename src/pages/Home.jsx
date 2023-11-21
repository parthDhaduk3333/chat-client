import { current } from '@reduxjs/toolkit';
import React, { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Actions from '../Actions';
import { findUser, userList } from '../http';
import { initSocket } from '../socket';
import ChatArea from './ChatArea';
import Avatar from 'react-avatar';

const Home = () => {
    const socketRef = useRef(null);
    const { user } = useSelector(state => state.userDetails)
    const [users, setUsers] = useState([])
    const [currentUser, setCurrentUser] = useState(null)
    const [remount, setReMount] = useState(1)
    useEffect(() => {
        const init = async () => {
            socketRef.current = await initSocket();
            socketRef.current.on('connect_error', err => handleError(err))
            socketRef.current.on('connect_failed', err => handleError(err))
            const handleError = (e) => {
                console.log('socket error', e.message);
                toast.error(e)
            }
            socketRef.current.emit(Actions.JOIN, { recevierId: user._id })
            socketRef.current.on(Actions.JOINED, () => {
                setReMount(10)
            })
        }
        init()
    }, [])
    useEffect(() => {
        const userlist = async () => {
            const usersdata = await userList()
            if (usersdata.data?.success) {
                setUsers(usersdata.data.users)
            }
        }
        userlist();
    }, [remount])
    const chat = async (id) => {
        const { data } = await findUser(id)
        if (data?.success) {
            setCurrentUser(data.user)
        } else {
            toast.error("something went wrong")
        }
    }
    return (
        <>
            <div className="container">
                <div className="row">
                    <div className="col-lg-3 users border">
                        {
                            users.map((Singleuser, index) => {
                                return (
                                    <>
                                        {
                                            Singleuser._id != user._id ? <div onClick={e => chat(Singleuser._id)} key={index} style={{ cursor: 'pointer' }}>
                                                <div className="card margin">
                                                    <div className="d-flex align-items-center my-2 px-3">
                                                        <Avatar name={Singleuser.name} size="50" textSizeRatio="3" className='rounded-circle fw-bold'/>
                                                        <h5 className="ms-2 fw-bolder mb-0">{Singleuser.name}</h5>
                                                    </div>
                                                </div>
                                            </div>
                                            : ""
                                        }
                                    </>
                                )
                            })
                        }
                    </div>
                    <div className="col-lg-9">
                        {currentUser ?
                            <ChatArea user={currentUser} socketRef={socketRef}></ChatArea>
                            :
                            <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }} >
                                <h3>
                                    Welcome to my own chat application
                                </h3>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </>
    )
}

export default Home