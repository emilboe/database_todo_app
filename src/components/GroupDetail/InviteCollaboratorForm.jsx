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


    //invitation: 
    // const handleSubmitInvitation = async (event) => {
    //   event.preventDefault()
    //   console.log('array and name:', collaborators, collabName)
    //   let found = false
    //   if (!collabName) {
    //     alert('no input...')
    //     return
    //   }

    //   collaborators.forEach(el => {
    //     if (el.collabName === collabName) {
    //       alert('user is already a collaborator!')
    //       found = true
    //       return
    //     }
    //   })
    //   if (!found) {
    //     try {
    //       console.log('sending data')
    //       await db.collection('invitations').doc(collabName).collection('invites').add({
    //         collabName,
    //         groupID: currentUser.uid + group,
    //         invitedBy: currentUser.displayName,
    //         groupName: group
    //       }, { merge: true })
    //       // await db.collection('groups').doc(currentUser.uid + group).collection('collaborators').add({
    //       //   collabName
    //       // }, { merge: true })
    //       alert('user invited!')
    //     }
    //     catch (err) {
    //       console.log(err)
    //     }
    //     setTitle('')
    //     return
    //   }
    // }

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
                console.log("Document data:", groupData.data())
                groupName = groupData.data().groupName
            }

            try {
                console.log('inviting user')
                console.log('emailRef', emailRef.current.value)
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
