import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../firebase';
import { Link, useNavigate } from 'react-router-dom';
import { query, onSnapshot } from 'firebase/firestore';
import './Profile.css'


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
  }, [currentUser.email])

  function handleLogout() {
    logout()
    navigate('/login')
  }

  const capitalize = str => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  return (
    <div className='profileContainer'>
      <img src={currentUser.photoURL ? currentUser.photoURL : 'https://i.imgur.com/DvtKeuk.png'} alt={currentUser.photoURL ? currentUser.displayName + ' profile picture' : 'default profile picture'} className="ProfilePFP" />
      <h2 className='otoma'>{capitalize(currentUser.displayName)}</h2>

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
      <div className='profileOptions'>
        <Link to="/update-profile"><button className="baseWhite">Update Profile</button></Link>
        <Link to="/"><button className="baseWhite">Dashboard</button></Link>
        <button className="coral" onClick={handleLogout}>Log out</button>
      </div>
    </div>
  )

}
