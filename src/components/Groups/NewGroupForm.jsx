import React, { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../firebase';
import { query, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import './Groups.css'

export default function NewGroupForm(showForm) {
    const { currentUser } = useAuth()
    const groupNameRef = useRef('')
    const emailsRef = useRef('')
    const [error, setError] = useState('')
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()


    const handleSubmit = async (event) => {
        event.preventDefault()

        if (groupNameRef !== '') {
            try {
                console.log('making new group in user group access')
                await db.collection('userData').doc(currentUser.uid).collection('groupAccess').add({
                    groupName: groupNameRef.current.value
                })
                console.log('new group access success')
                showForm.showForm()
            }
            catch (err) {
                console.log(err)
            }
        }
        else alert('Ingen gruppenavn?')
    }

    return (
        <div className='popupForm'>
            <div className='popupContent'>
                <h1>Legg til ny Gruppe</h1>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Gruppenavn</label>
                        <input
                            type="text"
                            placeholder='Familien'
                            ref={groupNameRef}
                            required
                            autoComplete="off" />
                    </div>
                    <div>
                        <label>Inviter medlemmer</label>
                        <input
                            type="text"
                            placeholder='epost@hamle.no'
                            ref={emailsRef}
                            autoComplete="off" />
                    </div>
                    <div>{error ? error : ''}</div>
                    <div>{message ? message : ''}</div>

                    <button className="grassBG" type="submit">Legg til</button>
                </form>
                <button onClick={() => showForm.showForm()}>Avbryt</button>

            </div>
        </div>
    )
}
