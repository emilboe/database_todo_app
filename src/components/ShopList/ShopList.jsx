import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import Todo from '../TodoItem/TodoItem';
import { query, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import '../ShopList/ShopList.css';
import hamsterDeco from './questionable.png';

export default function ShopList(props) {
  const { groupID } = props
  const [title, setTitle] = useState('')
  const [prevGroupID, setPrevGroupID] = useState('')
  const [todo, setTodo] = useState([])
  const [todoChecked, setTodoChecked] = useState(false)

  const fetchList = (col) => {
    const q = query(db.collection('groups').doc(col).collection('list'))
    const unsub = onSnapshot(q, (querySnapshot) => {
      let todosArray = []
      querySnapshot.forEach((doc) => {
        todosArray.push({ ...doc.data(), id: doc.id })
      })
      setTodo(todosArray)
    })
    return () => unsub()
  }
  const moveCheckedToFridge = () => {
    let tempArray = []
    todo.forEach((item, i) => {
      if (item.completed) {
        tempArray.push(todo.slice(i))
      }
    })
    console.log('tempArray', tempArray)
  }
  const checkIfChecked = () => {
    todo.forEach((item) => { if (item.completed) setTodoChecked(true) })
    console.log('todo', todo)
    console.log('checked')
  }
  useEffect(() => {
    // checkIfChecked()
  }, [])

  if (groupID !== prevGroupID) {
    fetchList(groupID)
    setPrevGroupID(groupID)
  }

  const handleEdit = async (todo, title) => {
    await updateDoc(doc(db, "groups", groupID, 'list', todo.id), { title: title })
  }
  const toggleComplete = async (todo) => {
    await updateDoc(doc(db, "groups", groupID, 'list', todo.id), { completed: !todo.completed })
      // .then(checkIfChecked())
  }
  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "groups", groupID, 'list', id))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (title !== '') {
      try {
        console.log('sending data to shopping list:', groupID)
        await db.collection('groups').doc(groupID).collection('list').add({
          title,
          completed: false
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
      <main className="shopListMain">
        <form onSubmit={handleSubmit} className="addInput">
          <input
            type='text'
            placeholder='Legg til'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          ></input>
        </form>
        {
          todo[0] ?
            <>
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
              {/* {todoChecked && <div>hey</div>} */}
            </>
            :
            <div className='centered'>
              <img alt="" src={hamsterDeco} />
              <p>handlelista di er tom...</p>
            </div>
        }
      </main>
    </React.Fragment>
  )

}
