import React, { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext';
import './Profile.css';

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
            <header className="updateProfileHeader">
                <h1>Oppdater informasjon</h1>
                <img src={currentUser.photoURL ? currentUser.photoURL : 'https://i.imgur.com/DvtKeuk.png'} alt={currentUser.photoURL ? 'profile picture' : 'no pfp url'} className="pfp" />
            </header>

            <main className="updateProfileMain">
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Navn</label>
                        <input
                            type="text"
                            ref={displayNameRef}
                            required
                            autoComplete="off"
                            defaultValue={currentUser.displayName} />
                    </div>
                    <div>

                        <label>Bilde-URL</label>
                        <input
                            type="text"
                            ref={photoURLRef}
                            autoComplete="off"
                            defaultValue={currentUser.photoURL} />
                    </div>
                    <div>
                        <label>E-post</label>
                        <input
                            type="email"
                            ref={emailRef}
                            autoComplete="off"
                            defaultValue={currentUser.email} />
                    </div>
                    <div>
                        <label>Passord</label>
                        <input
                            type="password"
                            autoComplete="off"
                            defaultValue={""}
                            ref={passwordRef}
                            placeholder="La være tom om du ikke vil endre"
                        />
                    </div>
                    <div>
                        <label>Bekreft passord</label>
                        <input
                            type="password"
                            autoComplete="off"
                            ref={passwordConfirmRef}
                            placeholder="La være tom om du ikke vil endre"
                        />
                    </div>
                    <button className="greenBG" disabled={loading} type="submit">Oppdater informasjon</button>
                    <div>{error ? error : ''}</div>
                    <div>{message ? message : ''}</div>
                </form>
                <Link to="/profile"><button className="greenBorder">Avbryt</button></Link>
            </main>
        </React.Fragment>
    )
}
