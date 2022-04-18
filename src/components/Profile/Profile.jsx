import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import './Profile.css'


export default function Profile() {
  const { currentUser, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  const capitalize = str => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  const { displayName, photoURL } = currentUser
  return (
    < div className='profileContainer' >
      <img src={photoURL ? photoURL : 'https://i.imgur.com/DvtKeuk.png'} alt={photoURL ? displayName + ' profile picture' : 'default profile picture'} className="ProfilePFP" />
      <h2 className='otoma'>{ displayName ? capitalize(displayName) : 'username'}</h2>

      <div className='profileOptions'>
        <Link to="/update-profile"><button className="baseWhite">Update Profile</button></Link>
        <Link to="/invitations"><button className="baseWhite">Invitasjoner</button></Link>
        <button className="coral" onClick={handleLogout}>Log out</button>
      </div>
    </div >
  )

}
