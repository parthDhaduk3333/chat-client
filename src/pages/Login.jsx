import React from 'react'
import { useState } from 'react'
import { login } from '../http';
import { useDispatch } from 'react-redux';
import { setIsAuth, setUser } from '../store/userSlice';
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom';
const Login = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const dispatch = useDispatch()
    const submit = async () => {
        const res = await login({ email, password })
        if (res) {
            if(res.data.success) {
                dispatch(setUser(res.data.user))
                dispatch(setIsAuth(true))
                toast.success("login successfully")
            } else {
                toast.error("login Failed")
            }
        } else {
            toast.error("login Failed")
        }
    }
    return (
        <>
            <div className="container">
                <div className="row" style={{height:"70vh"}}>
                    <div className="col-lg-4 m-auto border p-4">
                        <div className="mb-3">
                            <label className='mb-2'>Email</label>
                            <input type="text" className="form-control"  value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter Your Email"/>
                        </div>
                        <div className="mb-3">
                            <label className='mb-2'>Password</label>
                            <input type="password" className="form-control"  value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter Your Password"/>
                        </div>
                        <div className="mb-3">
                            <div className="text-center text-primary ">Forgot password ?</div>
                        </div>
                        <div>
                        <button className="btn btn-primary w-100" onClick={submit}>Submit</button>
                        </div>
                        <div className="mt-3">
                            <div className="text-center">Don't have an account ? <Link to="/register" className='text-primary'>Register</Link> </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Login