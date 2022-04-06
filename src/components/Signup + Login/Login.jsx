import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './login.css';

export default function Login() {
    const emailRef = useRef()
    const passwordRef = useRef()
    const { login, currentUser } = useAuth()
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    async function handleSubmit(event) {
        event.preventDefault()

        setError('')
        setLoading(true)

        const res = await login(emailRef.current.value, passwordRef.current.value)

        // Not a great way to handle error codes, but fine for now.
        if (res.error) {
            setError(res.message.message.substring(10).replace('auth/', '').replace(/-/g, ' '))
        } else {
            navigate('/')
        }

        setLoading(false)
    }

    const redirectIfLoggedIn = () => {
        currentUser && navigate('/')
    }
    useEffect(() => {
        redirectIfLoggedIn()
    })

    return (
        <div className="loginContainer">
            <h1>Logo</h1>
            <form onSubmit={handleSubmit} className="fillForm">
                <div className='inputSection'>
                    <label>Email</label>
                    <input type="email" ref={emailRef} required />
                </div>
                <div>
                    <label>Password</label>
                    <input type="password" ref={passwordRef} required />
                </div>
                <button className="greenBG" disabled={loading} type="submit">Log in</button>
                <div>{error ? error : ''}</div>
                <div className='forgotPWSection'>
                    <label>Glemt passord?</label>
                    <Link to='/forgot-password'><button className="grassBG">Reset passord</button></Link>
                </div>

            </form>
            <div className='signupSection'>
                <label>Don't have an account?</label>
                <Link to="/signup"> <button className="grassBG">Sign up</button></Link>
            </div>


            <div>{currentUser && "you're already logged in as: " + currentUser.email}</div>
        </div>
    )
}
