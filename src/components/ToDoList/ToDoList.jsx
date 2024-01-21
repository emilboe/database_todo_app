import React, { useState } from 'react';
import { db } from '../../firebase';
import Todo from '../TodoItem/TodoItem';
import { query, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import './ToDoList.css';
import hamsterDeco from './questionable.png';

export default function ToDoList(props) {
  const { groupID } = props
  const [title, setTitle] = useState('')
  const [prevGroupID, setPrevGroupID] = useState('')
  const [todo, setTodo] = useState([])
  const [todoChecked, setTodoChecked] = useState([])

  const fetchList = (col) => {
    const q = query(db.collection('groups').doc(col).collection('todolist'))
    const unsub = onSnapshot(q, (querySnapshot) => {
        let todosArray = []
        let todosArrayChecked = []
        querySnapshot.forEach((doc) => {
          if (doc.data().completed) todosArrayChecked.push({ ...doc.data(), id: doc.id })
          else todosArray.push({ ...doc.data(), id: doc.id })
        })
        setTodo(todosArray)
        setTodoChecked(todosArrayChecked)
      })
    return () => unsub()
  }
  const removeCheckedItems = async () => {
    todoChecked.forEach((item, i) => {
      handleDelete(item.id)
    })
  }

  if (groupID !== prevGroupID) {
    fetchList(groupID)
    setPrevGroupID(groupID)
  }

  const handleEdit = async (todo, title) => {
    await updateDoc(doc(db, "groups", groupID, 'todolist', todo.id), { title: title })
  }
  const toggleComplete = async (todo) => {
    await updateDoc(doc(db, "groups", groupID, 'todolist', todo.id), { completed: !todo.completed })
  }
  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "groups", groupID, 'todolist', id))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (title !== '') {
      try {
        console.log('sending data to todo:', groupID)
        await db.collection('groups').doc(groupID).collection('todolist').add({
          title,
          complete: false,
          creationDate: Date.now()
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
      <main className="ToDoMain">
        <form onSubmit={handleSubmit} className="addInput">
          <input
            type='text'
            placeholder='Legg til'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          ></input>
        </form>
{
          todo[0] || todoChecked[0] ?
            <>
              <div className='listUnchecked'>
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
              </div>
              {todoChecked[0] &&
                <div className='listChecked'>
                  {
                    todoChecked.map(todo => (
                      <Todo
                        key={todo.id}
                        todo={todo}
                        handleEdit={handleEdit}
                        handleDelete={handleDelete}
                        toggleComplete={toggleComplete}
                      />
                    ))
                  }
                  <div className='options'>
                    <button className='greenBorder' onClick={removeCheckedItems}>Fjern</button>
                  </div>
                </div>
              }
            </>
            :
            <div className='centered'>
              <img alt="" src={hamsterDeco} />
              <p>Legg til noe du må få gjort!</p>
            </div>
        }
      </main>
    </React.Fragment>
  )

}
