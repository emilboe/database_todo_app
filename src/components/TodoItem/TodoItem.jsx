import React, { useState } from 'react';
import './TodoItem.css';

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
            <input className="itemCheckbox" type="checkbox" onClick={() => toggleComplete(todo)}/>
            <input
                style={{ textDecoration: todo.completed && "line-through" }}
                type='text'
                value={todo.title === '' ? newTitle : todo.title}
                onChange={handleChange}
                onBlur={()=> handleEdit(todo, newTitle)}
                onKeyPress={(event) => function search(ele) {
                    var key = event.key || event.keyCode;
                    if(key === 13) {
                        alert(ele.value);        
                    }
                }}
            />
            {/* 
                // save edit moved to onblur instead of button

                <button className='purp' onClick={() => handleEdit(todo, newTitle)}>Save</button> 
            */}
             <button className='coral' onClick={() => handleDelete(todo.id)}>Slett</button> 

        </div>
    )
}
