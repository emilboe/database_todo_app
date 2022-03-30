import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { Link, useNavigate } from 'react-router-dom';
import Todo from './TodoItem';
import { query, onSnapshot, doc, updateDoc, deleteDoc, collection } from 'firebase/firestore';



export default function Dashboard() {
  const { currentUser, logout } = useAuth()
  const navigate = useNavigate()
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
  }, [])
  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <>
      <h1>Profile</h1>
      <img src={currentUser.photoURL ? currentUser.photoURL : 'https://i.imgur.com/DvtKeuk.png'} alt={currentUser.photoURL ? currentUser.displayName + ' profile picture' : 'default profile picture'} className="pfp" />
      <p>{currentUser.displayName}</p>
      <br />
      <br /><br />

      {
        invitations.map(invite => (
          <div className='inviteCard'>
            <p>Invited by: {invite.invitedBy}</p>
            <p>Invited to: {invite.groupName}</p>
            <button className="green">Accept</button>
            <button className="red">Decline</button>
          </div>
        ))
      }
      < br /><br />
      <button className="red" onClick={handleLogout}>Log out</button>
      <br />
      <Link to="/update-profile"><button className="green">Update Profile</button></Link>
      <br></br>
      <Link to="/"><button className="green">Dashboard</button></Link>
    </>
  )

}
