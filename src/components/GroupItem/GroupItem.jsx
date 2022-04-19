import React from 'react';
import { Link } from 'react-router-dom';
import './GroupItem.css'
export default function GroupItem({ groupID, groupName }) {

    const capitalize = str => {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    
    return (
        <Link to={`${groupID}`}>
            <div className='groupItem'>
                <h2 className='groupTitle'>{capitalize(groupName)}</h2>
                <p>GroupID: {groupID}</p>
            </div>
        </Link>
    )
}
