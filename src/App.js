import { BrowserRouter as Router, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import { Toaster } from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { loginCheck } from './http';
import { setIsAuth, setUser } from './store/userSlice';
import SingleChat from './pages/SingleChat';
const App = () => {
    const dispatch = useDispatch()
    useEffect(() => {
        const autoLogin = async () => {
            const { data } = await loginCheck();
            if (data.success) {
                dispatch(setUser(data.user))
                dispatch(setIsAuth(true))
            }
        }
        autoLogin();
    }, [])
    return (
        <>
            <Toaster position='top-right' />
            <Router>
                <Routes>
                    <Route path='/login' element={
                        <AuthRoute>
                            <Login />
                        </AuthRoute>
                    }></Route>
                    <Route path='/register' element={
                        <AuthRoute>
                            <Register />
                        </AuthRoute>
                    }></Route>
                    <Route
                        exact
                        path='/'
                        element={
                            <PrivateRoute>
                                <Home />
                            </PrivateRoute>
                        }>
                    </Route>
                    <Route
                        path='/privet/:id'
                        element={
                            <PrivateRoute>
                                <SingleChat/>
                            </PrivateRoute>
                        }>
                    </Route>
                </Routes>
            </Router>
        </>
    );
}

const PrivateRoute = ({ children }) => {
    const { isAuth } = useSelector(state => state.userDetails)
    // const isAuth = false
    let location = useLocation();
    if (isAuth) {
        return children
    }
    return <Navigate to={{ pathname: '/login', state: { from: location } }} />
}

const AuthRoute = ({ children }) => {
    const { isAuth } = useSelector(state => state.userDetails)
    let location = useLocation();
    if (isAuth) {
        return <Navigate to={{ pathname: '/', state: { from: location } }} />
    }
    return children
}

export default App;