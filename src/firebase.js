import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import { getFirestore } from "firebase/compat/firestore";

const app = firebase.initializeApp({
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_AUTHDOMAIN,
    projectId: process.env.REACT_APP_PROJECTID,
    storageBucket: process.env.REACT_APP_STORAGEBUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGINGSENDERID,
    appId: process.env.REACT_APP_APPID,
    measurementId: process.env.REACT_APP_MEASUREMENTID
})

var db = app.firestore()
const auth = app.auth()
console.log(app)

export {
    db,
    auth
}
export default app
