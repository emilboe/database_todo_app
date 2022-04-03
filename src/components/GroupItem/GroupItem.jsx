import React from 'react';
import './GroupItem.css'
export default function GroupItem({ groupID, groupName }) {

    const capitalize = str => {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    return (
        <div className='groupItem'>
            <h2 className='groupTitle'>{capitalize(groupName)}</h2>
            <p>GroupID: {groupID}</p>
        </div>
    )
}
