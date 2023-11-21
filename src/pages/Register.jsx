import React from 'react'
import { useState } from 'react'
import { login, register } from '../http';
import { useDispatch } from 'react-redux';
import { setIsAuth, setUser } from '../store/userSlice';
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom';


const Register = () => {
    const [name, setName] = useState("")
    const [city, setCity] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const dispatch = useDispatch()
    const submit = async () => {
        const res = await register({ email, password, city, name })
        if (res) {
            if (res.data.success) {
                dispatch(setUser(res.data.user))
                dispatch(setIsAuth(true))
                toast.success(res.data.msg)
            }
        }
    }
    return (
        <>
            <div className="container">
                <div className="row" style={{ height: "70vh" }}>
                    <div className="col-lg-4 m-auto border p-4">
                        <div className="mb-3">
                            <label className='mb-2'>Name</label>
                            <input type="text" className="form-control" value={name} onChange={e => setName(e.target.value)} placeholder="Enter Your Name" />
                        </div>
                        <div className="mb-3">
                            <label className='mb-2'>Email</label>
                            <input type="text" className="form-control" value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter Your Email" />
                        </div>
                        <div className="mb-3">
                            <label className='mb-2'>City</label>
                            <input type="text" className="form-control" value={city} onChange={e => setCity(e.target.value)} placeholder="Enter Your Email" />
                        </div>
                        <div className="mb-3">
                            <label className='mb-2'>Password</label>
                            <input type="password" className="form-control" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter Your Password" />
                        </div>
                        <div>
                            <button className="btn btn-primary w-100" onClick={submit}>Submit</button>
                        </div>
                        <div className="mt-3">
                            <div className="text-center">Already have an account ? <Link to="/login" className='text-primary'>Login</Link> </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );

}

export default Register