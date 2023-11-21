import axios from 'axios';

const api = axios.create({
    baseURL: "http://localhost:2000",
    headers:{
        "Content-Type" : 'application/json',
        "Accept":"application/json"
    },
    withCredentials: true
})

export const login = (data) => api.post('/login',data)
export const loginCheck = () => api.get('/logincheck')
export const register = (data) => api.post('/register',data)
export const userList = () => api.get('/userlist')
export const findUser = (id) => api.get(`/finduser/${id}`)
export const getmessages = (data) => api.post('/getmessages',data)