import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../firebase';
import { query, onSnapshot } from 'firebase/firestore';
import './Invitations.css'

export default function Invitations() {
    const { currentUser } = useAuth()
    const [invitations, setInvitations] = useState([])

    const fetchInvitations = (email) => {
        const q = query(db.collection('invitations').doc(email).collection('invites'))
        const unsub = onSnapshot(q, (querySnapshot) => {

            let collabArray = []
            querySnapshot.forEach((doc) => {
                collabArray.push({ ...doc.data(), id: doc.id })
            })
            console.log('fetched', collabArray)
            setInvitations(collabArray)
        })
        return () => unsub()
    }

    useEffect(() => {
        fetchInvitations(currentUser.email)
    }, [currentUser.email])

    const capitalize = str => {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    return (
        < div className='profileContainer' >
            <h1> Invitasjoner </h1>

            {
                invitations.map(invite => (
                    <div className='inviteCard' key={invite.id}>
                        <p>Invited by: {invite.invitedBy}</p>
                        <p>Invited to: {invite.groupName}</p>
                        <button className="green">Accept</button>
                        <button className="red">Decline</button>
                    </div>
                ))
            }
        </div >
    )

}
