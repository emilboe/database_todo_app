import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useParams } from 'react-router-dom';
import InviteCollaboratorForm from './InviteCollaboratorForm';


export default function GroupDetail() {
    const { currentUser } = useAuth()
    const [formShow, setformShow] = useState(false)

    const { groupID } = useParams()


    const showForm = () => {
        setformShow(!formShow)
    }

    const { displayName, photoURL } = currentUser
    return (
        < div className='profileContainer' >
            <h1>
                {groupID}
            </h1>
            <img src={photoURL ? photoURL : 'https://i.imgur.com/DvtKeuk.png'} alt={photoURL ? displayName + ' profile picture' : 'default profile picture'} className="ProfilePFP" />

            {formShow && <InviteCollaboratorForm showForm={showForm} />}
            <button className='grassBG' onClick={() => showForm()}>Legg til bruker +</button>
        </div >
    )

}
