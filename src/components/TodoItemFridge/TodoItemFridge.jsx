import React, { useState } from 'react';
import './TodoItemFridge.css';

export default function Todo({ todo, creationDate, toggleComplete, handleDelete, handleEdit }) {
    const [newTitle, setNewTitle] = useState(todo.title)
    const handleChange = event => {
        event.preventDefault()
        if (todo.complete) setNewTitle(todo.title)
        else {
            todo.title = ''
            setNewTitle(event.target.value)
        }
    }
    const datediff = (first, second) => {
        // Take the difference between the dates and divide by milliseconds per day.
        // Round to nearest whole number to deal with DST.
        let days;
        // days = Math.round((second - first) / (1000 * 60 * 60 * 24));
        days = Math.round((second - first) / (1000 * 6));
        if (days > 0) return days
    }

    return (
        <div className='todoItemFridge'>
            <div>
                <input
                    style={{ textDecoration: todo.completed && "line-through" }}
                    type='text'
                    value={todo.title === '' ? newTitle : todo.title}
                    onChange={handleChange}
                    onBlur={() => handleEdit(todo, newTitle)}
                    onKeyPress={(event) => function search(ele) {
                        var key = event.key || event.keyCode;
                        if (key === 13) {
                            alert(ele.value);
                        }
                    }}
                />
                {/* <span className='datediff'>{datediff(creationDate, Date.now())}</span> */}
            </div>

            {/* 
                // save edit moved to onblur instead of button

                <button className='purp' onClick={() => handleEdit(todo, newTitle)}>Save</button> 
            */}
            <button className='coral' onClick={() => handleDelete(todo.id)}>Slett</button>

        </div>
    )
}
