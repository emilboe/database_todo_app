import React, { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext';

export default function UpdateProfile() {
    const { updateEmail, updatePassword, currentUser, logout, updateUsername, updatePhotoURL } = useAuth()
    const emailRef = useRef(currentUser.email)
    const passwordRef = useRef()
    const passwordConfirmRef = useRef()
    const displayNameRef = useRef(currentUser.displayName)
    const photoURLRef = useRef(currentUser.photoURL ? currentUser.photoURL : '')
    const [error, setError] = useState('')
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    function handleLogout() {
        logout()
        navigate('/login')
    }

    function handleSubmit(event) {
        event.preventDefault()
        if (passwordRef.current.value !== passwordConfirmRef.current.value) {
            setError('passwords do not match')
            return
        }

        const promises = []
        setLoading(true)
        setError('')
        setMessage("")

        if (emailRef.current.value !== currentUser.email) {
            promises.push(updateEmail(emailRef.current.value))
        }
        else if (displayNameRef.current.value !== currentUser.displayName) {
            promises.push(updateUsername(displayNameRef.current.value))
        }
        else if (photoURLRef.current.value !== currentUser.photoURL) {
            promises.push(updatePhotoURL(photoURLRef.current.value))
        }
        else if (passwordRef.current.value) {
            promises.push(updatePassword(passwordRef.current.value))
        }
        else {
            setLoading(false)
            setMessage("You haven't changed anything!")
            return
        }

        Promise.all(promises).then((res) => {

            if (res[0].error) {
                console.log(res[0].message.message)
                setError(res[0].message.message.substring(10).replace('auth/', '').replace(/-/g, ' '))
            } else {
                navigate('/')
            }
            setLoading(false)

        })
    }

    return (
        <React.Fragment>
            <h1>Update Profile</h1>
            <form onSubmit={handleSubmit}>
                <div>{currentUser && "You're currently logged in with : " + currentUser.email}</div>

                <div>
                    <label>DisplayName</label>
                    <input
                        type="text"
                        ref={displayNameRef}
                        required
                        autoComplete="off"
                        defaultValue={currentUser.displayName} />
                </div>
                <div>

                    <img src={currentUser.photoURL ? currentUser.photoURL : 'https://i.imgur.com/DvtKeuk.png'} alt={currentUser.photoURL ? 'profile picture' : 'no pfp url'} className="pfp" />

                    <label>PhotoURL</label>
                    <input
                        type="text"
                        ref={photoURLRef}
                        autoComplete="off"
                        defaultValue={currentUser.photoURL} />
                </div>
                <div>
                    <label>Email</label>
                    <input
                        type="email"
                        ref={emailRef}
                        autoComplete="off"
                        defaultValue={currentUser.email} />
                </div>
                <div>
                    <label>Password</label>
                    <input
                        type="password"
                        autoComplete="off"
                        defaultValue={""}
                        ref={passwordRef}
                        placeholder="Leave blank to not change"
                    />
                </div>
                <div>
                    <label>Confirm Password</label>
                    <input
                        type="password"
                        autoComplete="off"
                        ref={passwordConfirmRef}
                        placeholder="Leave blank to not change"
                    />
                </div>
                <button className="grassBG" disabled={loading} type="submit">Update Information</button>
                <div>{error ? error : ''}</div>
                <div>{message ? message : ''}</div>
            </form>
            <Link to="/profile"><button>Cancel</button></Link>
        </React.Fragment>
    )
}
