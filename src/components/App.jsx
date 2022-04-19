import React, { useState } from 'react';
import { AuthProvider } from '../contexts/AuthContext';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Signup from './Signup+Login/Signup';
import Handleliste from '../components/ShopList/ShopList';
import Login from './Signup+Login/Login';
import Lost from '../components/Lost/Lost';
import PrivateRoute from './PrivateRoute';
import ForgotPW from './Signup+Login/ForgotPW';
import Profile from './Profile/Profile';
import UpdateProfile from './Profile/UpdateProfile';
import Fridge from './Fridge/Fridge';
import NavBar from './NavBar/NavBar';
import Groups from '../components/Groups/Groups'
import GroupDetail from '../components/GroupDetail/GroupDetail'
import Invitations from '../components/Invitations/Invitations'
import './globals.css'
import CurrentGroup from './CurrentGroup/CurrentGroup';

export default function App() {

  const [groupID, setGroupID] = useState('')
  console.log('groupID from App.jsx: ', groupID)

  return (
    <Router>
      <section>
        <AuthProvider>

          <div className="globalBox">
            <link rel="manifest" href="../build/manifest.json" />
            <Routes>
              <Route exact path='/' element={
                <PrivateRoute>
                  <CurrentGroup groupID={groupID} setGroupID={setGroupID} />
                  <Handleliste groupID={groupID} />
                  <NavBar />
                </PrivateRoute>
              } />
              <Route exact path='/fridge' element={
                <PrivateRoute>
                  <CurrentGroup groupID={groupID} setGroupID={setGroupID} />
                  <Fridge groupID={groupID} />
                  <NavBar />
                </PrivateRoute>
              } />
              <Route exact path='/update-profile' element={
                <PrivateRoute>
                  <UpdateProfile />
                  <NavBar />
                </PrivateRoute>
              } />

              <Route exact path='/profile' element={
                <PrivateRoute>
                  <Profile />
                  <NavBar />
                </PrivateRoute>
              } />
              <Route exact path='/groups' element={
                <PrivateRoute>
                  <Groups />
                  <NavBar />
                </PrivateRoute>
              } />
              <Route path='/groups/:groupID' element={
                <PrivateRoute>
                  <GroupDetail />
                  <NavBar />
                </PrivateRoute>
              } />
              <Route exact path='/invitations' element={
                <PrivateRoute>
                  <Invitations />
                  <NavBar />
                </PrivateRoute>
              } />

              <Route path="/signup" element={<Signup />} />
              <Route path="/login" element={<Login />} />
              <Route path="/forgot-password" element={<ForgotPW />} />
              <Route path="/*" element={<Lost />} />
            </Routes>
          </div>
        </AuthProvider>
      </section>
    </Router>

  );
}

