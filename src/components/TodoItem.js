import React, { useState } from 'react';

export default function Todo({ todo, toggleComplete, handleDelete, handleEdit }) {
    const [newTitle, setNewTitle] = useState(todo.title)
    const handleChange = event => {
        event.preventDefault()
        if (todo.complete) setNewTitle(todo.title)
        else {
            todo.title = ''
            setNewTitle(event.target.value)
        }
    }

    return (
        <div className='todoItems'>
            <input
                style={{ textDecoration: todo.completed && "line-through" }}
                type='text'
                value={todo.title === '' ? newTitle : todo.title}
                onChange={handleChange}
            />
            <button className='green' onClick={() => toggleComplete(todo)}>Done</button>
            <button className='purp' onClick={() => handleEdit(todo, newTitle)}>Save</button>
            <button className='red' onClick={() => handleDelete(todo.id)}>Del</button>
        </div>
    )
}
