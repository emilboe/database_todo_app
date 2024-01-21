import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../firebase';
import { query, onSnapshot } from 'firebase/firestore';
import { Link, useNavigate } from 'react-router-dom';
import './Profile.css'


export default function Profile() {
  const { currentUser, logout } = useAuth()
  const [invitations, setInvitations] = useState([])
  const navigate = useNavigate()

  function handleLogout() {
    const result = window.confirm("Sikker på at du vil logge ut?");
    if (result) {
      logout()
      navigate('/login')
    }
  }

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

  const capitalize = str => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  useEffect(() => {
    fetchInvitations(currentUser.email)
  }, [currentUser.email])

  const { displayName, photoURL } = currentUser
  return (
    < div className='profileContainer' >
      <img src={photoURL ? photoURL : 'https://i.imgur.com/DvtKeuk.png'} alt={photoURL ? displayName + ' profile picture' : 'default profile picture'} className="ProfilePFP" />
      <h2 className='otoma'>{displayName ? capitalize(displayName) : 'username'}</h2>

      <div className='profileOptions'>
        <Link to="update-profile"><button className="greenBG">Oppdater Profil</button></Link>
        <Link to="invitations">
          <button className="greenBG">
            Invitasjoner
            {invitations[0] && <span className='notification'> {invitations.length}</span>}
          </button></Link>
          <Link to="groups"><button className="greenBG">Grupper</button></Link>
      </div>
      <button className="greenBorder logOutButton" onClick={handleLogout}>Logg ut</button>
    </div>
  )

}
