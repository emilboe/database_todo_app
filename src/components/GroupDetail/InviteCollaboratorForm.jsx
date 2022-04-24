import React, { useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../firebase';
import { doc, getDoc } from "firebase/firestore";
import './Groups.css'

export default function InviteCollaboratorForm(props) {
    const { currentUser } = useAuth()
    const emailRef = useRef('')
    const [error, setError] = useState('')
    const [message, setMessage] = useState('')

    const { groupID } = useParams()
    const fetchData = async () => {

    }
    fetchData()

    const handleSubmit = async (event) => {
        event.preventDefault()


        if (emailRef !== '') {
            let groupName;

            const groupData = await getDoc(doc(db, "userData", currentUser.uid, 'groupAccess', groupID));
            if (groupData.exists()) {
                groupName = groupData.data().groupName
            }

            try {
                console.log('inviting user')
                await db.collection('invitations').doc(emailRef.current.value).collection('invites').add({
                    invitedBy: currentUser.email,
                    groupID: groupID,
                    groupName: groupName
                })
                console.log('invite sent')
                props.showForm()
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
                <h1>Inviter bruker</h1>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Epost</label>
                        <input
                            type="email"
                            placeholder='ola@nordmann.no'
                            ref={emailRef}
                            required
                            autoComplete="off" />
                    </div>
                    <div>{error ? error : ''}</div>
                    <div>{message ? message : ''}</div>

                    <button className="grassBG" type="submit">Legg til</button>
                </form>
                <button onClick={() => props.showForm()}>Avbryt</button>

            </div>
        </div>
    )
}
