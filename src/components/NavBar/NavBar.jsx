import React, { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../firebase';
import { query, onSnapshot } from 'firebase/firestore';
import './NavBar.css';
import { Icon } from '@iconify/react';



export default function NavBar() {
  const { currentUser } = useAuth()
  const [invitations, setInvitations] = useState([])
  const location = useLocation()

  useEffect(() => {
    fetchInvitations(currentUser.email)
  }, [])

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

  const activeTab = (location, path) => {
    if (location.pathname.includes(path)) {
      return {
        backgroundColor: 'var(--color-pink)',
        color: "var(--color-moss)"
      };
    }
  };

  return (
    <React.Fragment>
      <link
        rel="stylesheet"
        href="https://pro.fontawesome.com/releases/v5.10.0/css/all.css"
        integrity="sha384-AYmEC3Yw5cVb3ZcuHtOA93w35dYTsvhLPVnYs9eStHfGJvOvKxVfELGroGkvsg+p"
        crossOrigin="anonymous"
      />
      <nav className="navigation">
        <NavLink
          to="/shoplist"
          style={activeTab(location, "/shoplist")}
        >
          <span className="icon, svgIcon"><Icon icon="el:list-alt" /></span>
          <span className="title">Handleliste</span>
        </NavLink>
        <NavLink
          to="/fridge"
          style={activeTab(location, "/fridge")}
        >
          <span className="icon, svgIcon"><Icon icon="cil:fridge" /></span>
          <span className="title">Kjøleskap</span>
        </NavLink>
        <NavLink
          to="/todo"
          style={activeTab(location, "/todo")}
        >
          <span className="icon, svgIcon"><Icon icon="lucide:list-todo" /></span>
          <span className="title">To do</span>
        </NavLink>
        <NavLink
          to="/profile"
          style={activeTab(location, "/profile")}
        >
          {invitations[0] && <span className='notification'> {invitations.length}</span>}
          <span className="icon"><i className="far fa-user"></i></span>
          <span className="title">Profil</span>
        </NavLink>
        <div className="indicator"></div>
      </nav>
    </React.Fragment>
  )

}
