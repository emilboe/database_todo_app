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
                    <label>E-post</label>
                    <input type="email" ref={emailRef} required />
                </div>
                <div>
                    <label>Passord</label>
                    <input type="password" ref={passwordRef} required />
                </div>
                <div className='forgotPWSection'>
                    <Link to='/forgot-password'>Glemt passord?</Link>
                </div>
                <button className="greenBG" disabled={loading} type="submit">Logg in</button>
                <div>{error ? error : ''}</div>
            </form>
            <div className='signupSection'>
                <label>Har du ikke en bruker?</label>
                <Link to="/signup"> <button className="greenBorder">Registrer deg</button></Link>
            </div>


            <div>{currentUser && "Du er allerede logget inn som: " + currentUser.email}</div>
        </div>
    )
}
