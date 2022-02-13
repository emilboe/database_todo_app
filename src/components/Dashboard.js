import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { Link, useNavigate } from 'react-router-dom';
import Todo from './TodoItem';
import { collection, query, onSnapshot, doc, updateDoc, deleteDoc, QuerySnapshot } from 'firebase/firestore';



export default function Dashboard() {
  const { currentUser, logout } = useAuth()
  const [title, setTitle] = useState('')
  const [list, setList] = useState(currentUser.email)
  const [todo, setTodo] = useState([])
  const navigate = useNavigate()

  const fetchList = (cltion) => {
    const q = query(collection(db, cltion))
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

  useEffect(() => {
    fetchList(list)
  }, [])


  const handleEdit = async (todo, title) => {
    await updateDoc(doc(db, list, todo.id), { title: title })
  }
  const toggleComplete = async (todo) => {
    await updateDoc(doc(db, list, todo.id), { completed: !todo.completed })
  }
  const handleDelete = async (id) => {
    await deleteDoc(doc(db, list, id))
  }

  const handleSwitchList = async (event) => {
    event.preventDefault()

    if (list !== '') {
      console.log('list:', list)
      fetchList(list)
    }
    else console.log('no list selected')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (title !== '') {

      try {
        console.log('sending data')
        await db.collection(list).add({
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

  function handleLogout() {
    logout()
    navigate('/login')
  }
  return (
    <>
      <h1>Dashboard</h1>
      <p>Email: {currentUser.email}</p>
      <form onSubmit={handleSubmit}>
        <input
          type='text'
          placeholder='New note'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        ></input>
        <button type="submit" className='green'>Add</button>
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

      <br /><br />
      <form onSubmit={handleSwitchList}>
        <label>Change List: </label>
        <input
          type='text'
          value={list}
          onChange={(e) => setList(e.target.value)}
        ></input>
        <button type="submit" className='green'>Change</button>
      </form>

      <br /><br />
      <button className="red" onClick={handleLogout}>Log out</button>
      <br />
      <Link to="/update-profile"><button className="green">Update Profile</button></Link>
    </>
  )

}
