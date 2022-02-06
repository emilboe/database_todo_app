import React from 'react';
import { Navigate } from 'react-router-dom'
import { getAuth } from 'firebase/auth'

export default function PrivateRoute({ children }) {
    const authed = getAuth() // getAuth() returns true or false based on localStorage

    if (authed.currentUser === null || authed.currentUser === undefined) {
        return <Navigate to='/login' />
    } else {
        return children
    }

}


