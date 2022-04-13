import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../firebase';
import { useNavigate } from 'react-router-dom';
import Todo from '../TodoItem/TodoItem';
import { query, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';



export default function Fridge() {
  const { currentUser, logout } = useAuth()
  const [title, setTitle] = useState('')
  const [collabName, setCollabName] = useState('')
  const [list, setList] = useState(currentUser.email)
  const [todo, setTodo] = useState([])
  const [collaborators, setCollaborators] = useState([])
  const [group, setGroup] = useState('personal')
  const navigate = useNavigate()

  const fetchList = (col) => {
    const q = query(db.collection('groups').doc(currentUser.uid + group).collection('fridge'))
    const unsub = onSnapshot(q, (querySnapshot) => {
      let todosArray = []
      querySnapshot.forEach((doc) => {
        todosArray.push({ ...doc.data(), id: doc.id })
      })
      setTodo(todosArray)
      // console.log('todo in useefetct: ', todo)
    })
    return () => unsub()

  }
  const fetchCollabs = (col) => {
    const q = query(db.collection('groups').doc(currentUser.uid + group).collection('collaborators'))
    const unsub = onSnapshot(q, (querySnapshot) => {

      let collabArray = []
      querySnapshot.forEach((doc) => {
        collabArray.push({ ...doc.data(), id: doc.id })
      })
      setCollaborators(collabArray)
    })
    return () => unsub()

  }

  useEffect(() => {
    fetchList(list)
    fetchCollabs()
  })

  const handleEdit = async (todo, title) => {
    await updateDoc(doc(db, list, todo.id), { title: title })
  }
  const toggleComplete = async (todo) => {
    await updateDoc(doc(db, list, todo.id), { completed: !todo.completed })
  }
  const handleDelete = async (id) => {
    await deleteDoc(doc(db, list, id))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (title !== '') {

      try {
        console.log('sending data')
        await db.collection('groups').doc(currentUser.uid + group).collection('fridge').add({
          title,
          complete: false
        })
        console.log('data sent')
      }
      catch (err) {
        console.log(err)
      }
      setTitle('')
    }
    else console.log('alert or maybe disable button first?')
  }

  const handleSubmitInvitation = async (event) => {
    event.preventDefault()
    console.log('array and name:', collaborators, collabName)
    let found = false
    if (!collabName) {
      alert('no input...')
      return
    }

    collaborators.forEach(el => {
      if (el.collabName === collabName) {
        alert('user is already a collaborator!')
        found = true
        return
      }
    })
    if (!found) {
      try {
        console.log('sending data')
        await db.collection('invitations').doc(collabName).collection('invites').add({
          collabName,
          groupID: currentUser.uid + group,
          invitedBy: currentUser.displayName,
          groupName: group
        }, { merge: true })
        // await db.collection('groups').doc(currentUser.uid + group).collection('collaborators').add({
        //   collabName
        // }, { merge: true })
        alert('user invited!')
      }
      catch (err) {
        console.log(err)
      }
      setTitle('')
      return
    }

  }



  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <React.Fragment>
      <h1>Fridge</h1>
      <p>Hello, {currentUser.displayName}</p>
      <p>Current group: {group}</p>
      <div className='collaborators'>
        Collaborators:
        {
          collaborators.map(user => (
            <p>{user.collabName}</p>
          ))
        }
        <img src={currentUser.photoURL ? currentUser.photoURL : 'https://i.imgur.com/DvtKeuk.png'} alt={currentUser.photoURL ? currentUser.displayName + ' profile picture' : 'default profile picture'} className="pfp" />
        <form onSubmit={handleSubmitInvitation} className="addInput">
          <input
            type='email'
            placeholder='Invite collaborator'
            value={collabName}
            onChange={(e) => setCollabName(e.target.value)}
          ></input>
          <button type="submit" className='green'>➕</button>
        </form>
      </div>
      <br />
      <form onSubmit={handleSubmit} className="addInput">
        <input
          type='text'
          placeholder='New note'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        ></input>
        <button type="submit" className='green'>➕</button>
      </form>
      <br /><br />
      {
        todo.map(todo => (
          <Todo
            key={todo.id}
            todo={todo}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
            toggleComplete={toggleComplete}
          />
        ))
      }
    </React.Fragment>
  )

}
