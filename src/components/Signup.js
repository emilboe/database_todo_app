import React, { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext';

export default function Signup() {
    const emailRef = useRef()
    const passwordRef = useRef()
    const passwordConfirmRef = useRef()
    const { signup, currentUser } = useAuth()
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    async function handleSubmit(event) {
        event.preventDefault()
        if (passwordRef.current.value !== passwordConfirmRef.current.value) {
            setError('passwords do not match')
            return
        }

        setError('')
        setLoading(true)
        const res = await signup(emailRef.current.value, passwordRef.current.value)
        
        // Not a great way to handle error codes, but fine for now.
        setLoading(false)
        if (res.error) {
            setError(res.message.message.substring(10).replace('auth/', '').replace(/-/g, ' '))
        }
        else {
            navigate('/')
        }
    }

    return (
        <>
            <h1>Sign up</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email</label><br />
                    <input type="email" ref={emailRef} required />
                </div>
                <div>
                    <label>Password</label><br />
                    <input type="password" ref={passwordRef} required />
                </div>
                <div>
                    <label>Confirm Password</label><br />
                    <input type="password" ref={passwordConfirmRef} required />
                </div>
                <br />
                <button className="purp" disabled={loading} type="submit">Sign up</button>
                <div>{error ? error : ''}</div>
            </form>
            <br />
            <div>Already have an account? <Link to="/login">
                <br />
                <button className="purp">Log in</button></Link></div>
            <br />
            <div>{currentUser && "you're already logged in as: " + currentUser.email}</div>
        </>
    )
}
