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
            setInvitations(collabArray)
        })
        return () => unsub()
    }

    useEffect(() => {
        fetchInvitations(currentUser.email)
    }, [currentUser.email])

    const handleInvite = async (bool, id, groupID, groupName) => {
        if (bool) {
            // console.log('accepting', groupID)
            try {
                console.log('making new group in user group access')
                await db.collection('userData').doc(currentUser.uid).collection('groupAccess').doc(groupID).set({
                    groupName: groupName,
                    id: groupID
                })
                    .then(
                        await db.collection('invitations').doc(currentUser.email).collection('invites').doc(id).delete()
                    )
                console.log('new group access success')
                alert('invite accepted!')
            }
            catch (err) {
                console.log(err)
            }
        }
        else if (!bool) {
            await db.collection('invitations').doc(currentUser.email).collection('invites').doc(id).delete()
            alert('invitation declined')
        }
    }
    return (
        < div className='profileContainer' >
            <h1> Invitasjoner </h1>

            {
                invitations[0] ? 
                invitations.map(invite => (
                    <div className='inviteCard' key={invite.id}>
                        <h2>Invitert av:</h2>
                        <p> {invite.invitedBy}</p>
                        <h2>Invitert til: </h2>
                        <p>{invite.groupName}</p>
                        <button className="greenBG" onClick={() => handleInvite(true, invite.id, invite.groupID, invite.groupName)}>Godkjenn</button>
                        <button className="greenBorder" onClick={() => handleInvite(false, invite.id, invite.groupID, invite.groupName)}>Avslå</button>
                    </div>
                ))
                :
                'ingen invitasjoner...'
            }
        </div >
    )

}
