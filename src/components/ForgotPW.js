import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function ForgotPW() {
    const emailRef = useRef()
    const {  currentUser, resetPassword } = useAuth()
    const [error, setError] = useState('')
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(false)

    async function handleSubmit(event) {
        event.preventDefault()

        setError('')
        setLoading(true)

        const res = await resetPassword(emailRef.current.value)

        // Not a great way to handle error codes, but fine for now.
        if (res.error) {
            setError(res.message.message.substring(10).replace('auth/', '').replace(/-/g, ' '))
        } else {
            setMessage('check your inbox!')
        }

        setLoading(false)
    }

    return (
        <>
            <h1>Password Reset</h1>
            <form onSubmit={handleSubmit}>

                <div>{currentUser && "You're currently logged in with : " + currentUser.email}</div>
                <br />
                <div>
                    <label>Email</label><br />
                    <input type="email" ref={emailRef} required />
                </div>
                <br />
                <button className="purp" disabled={loading} type="submit">Reset Password</button>
                <div>{error ? error : ''}</div>
            </form>
            {message}
            <br />
            <div>
                <Link to='/login'><button className="green">Login</button></Link>
            </div>
        </>
    )
}
