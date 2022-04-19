import React, { useState } from 'react';
import { db } from '../../firebase';
import Todo from '../TodoItem/TodoItem';
import { query, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';

export default function Fridge(props) {
  const { groupID } = props
  console.log('groupID in fridge:', groupID)
  const [title, setTitle] = useState('')
  const [prevGroupID, setPrevGroupID] = useState('')
  const [todo, setTodo] = useState([])

  const fetchList = (col) => {
    const q = query(db.collection('groups').doc(col).collection('fridge'))
    const unsub = onSnapshot(q, (querySnapshot) => {
      let todosArray = []
      querySnapshot.forEach((doc) => {
        todosArray.push({ ...doc.data(), id: doc.id })
      })
      setTodo(todosArray)
    })
    return () => unsub()
  }

  if (groupID !== prevGroupID) {
    fetchList(groupID)
    setPrevGroupID(groupID)
  }

  const handleEdit = async (todo, title) => {
    await updateDoc(doc(db, "groups", groupID, 'fridge', todo.id), { title: title })
  }
  const toggleComplete = async (todo) => {
    await updateDoc(doc(db, "groups", groupID, 'fridge', todo.id), { completed: !todo.completed })
  }
  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "groups", groupID, 'fridge', id))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (title !== '') {
      try {
        console.log('sending data to fridge:', groupID)
        await db.collection('groups').doc(groupID).collection('fridge').add({
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

  return (
    <React.Fragment>
      <h1>Fridge</h1>
      <form onSubmit={handleSubmit} className="addInput">
        <input
          type='text'
          placeholder='Legg til'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        ></input>
        <button type="submit" className='green'>➕</button>
      </form>
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
