import { DocumentReference } from 'firebase/firestore';
import React, { useContext, useState, useEffect } from 'react';
import { auth, db } from '../firebase.js'

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {

  const [currentUser, setCurrentUser] = useState()
  const [loading, setLoading] = useState(true)

  async function signup(email, password, displayName) {
    try {
      const res = await auth.createUserWithEmailAndPassword(email, password)

      db.collection('userData').doc(res.user.uid).collection('groupAccess').add({
        listName: 'personal'
      })
        // this whole section might me unnecesarry as it is possible to access the doc id later.
        .then(function (docRef) {
          console.log("Document written with ID: ", docRef.id);
          // surely it's possible to access docref while writing the the doc the firs time right?
          db.collection('userData').doc(res.user.uid).collection('groupAccess').doc(docRef.id).update({
            listID: docRef.id
          })
        })

      console.log("when u make a new user this is res: ", res);
      console.log("uid?: ", res.user.uid);

      res.user.updateProfile({ displayName })
      // // should make these DB writes modular and async/ await as well
      // db.collection('userData').doc(res.user.uid)({
      //   bio: 'hey',

      // })
      // let firstListName = 'personal'
      // db.collection('userData').doc(res.user.uid).collection('listAccess').add({
      //   listName: firstListName,
      //   listID: res.user.uid + firstListName,

      // })

      return {
        error: false,
        message: res
      }
    }
    catch (err) {
      console.log('in the catch block')
      return {
        error: true,
        message: err
      }
    }
  }
  async function login(email, password) {
    try {
      const res = await auth.signInWithEmailAndPassword(email, password)
      return {
        error: false,
        message: res
      }
    }
    catch (err) {
      return {
        error: true,
        message: err
      }
    }
  }

  function logout() {
    return auth.signOut()
  }

  useEffect(() => {
    // strange solution to "Can't perform a React state update on an unmounted component." react warning Part 1
    ifUserChangedIG()
    return () => {
      setCurrentUser({}); // This worked for me
    };
  }, [])


  // strange solution to "Can't perform a React state update on an unmounted component." react warning Part 2
  function ifUserChangedIG() {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setCurrentUser(user)
      setLoading(false)
    })

    return unsubscribe

  }

  async function resetPassword(email) {

    try {
      const res = await auth.sendPasswordResetEmail(email)
      return {
        error: false,
        message: res
      }
    }
    catch (err) {
      return {
        error: true,
        message: err
      }
    }
  }

  async function updateEmail(email) {

    try {
      const res = await currentUser.updateEmail(email)
      console.log('res: ', res)
      return {
        error: false,
        message: res
      }
    }
    catch (err) {
      return {
        error: true,
        message: err
      }
    }

  }

  function updatePassword(password) {

    try {
      const res = currentUser.updatePassword(password)
      return {
        error: false,
        message: res
      }
    }
    catch (err) {
      return {
        error: true,
        message: err
      }
    }
  }

  function updateUsername(username) {


    try {
      const res = currentUser.updateProfile({
        displayName: username
      })
      console.log('username update successful')
      return {
        error: false,
        message: res
      }
    }
    catch (err) {
      return {
        error: true,
        message: err
      }
    }
  }

  function updatePhotoURL(photoURL) {

    try {
      const res = currentUser.updateProfile({
        photoURL: photoURL
      })
      console.log('photourl update successful')
      return {
        error: false,
        message: res
      }
    }
    catch (err) {
      return {
        error: true,
        message: err
      }
    }
  }

  const value = {
    currentUser,
    login,
    signup,
    logout,
    resetPassword,
    updateEmail,
    updatePassword,
    updateUsername,
    updatePhotoURL
  }
  return (
    <AuthContext.Provider value={value} >
      {!loading && children}
    </AuthContext.Provider>
  )
}
