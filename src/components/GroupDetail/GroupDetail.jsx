import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useParams, useNavigate } from 'react-router-dom';
import InviteCollaboratorForm from './InviteCollaboratorForm';
import { db } from '../../firebase';
import { doc, getDoc, deleteDoc } from "firebase/firestore";


export default function GroupDetail() {
    const { currentUser } = useAuth()
    const [formShow, setformShow] = useState(false)
    const [groupName, setGroupName] = useState('')
    const navigate = useNavigate()

    const { groupID } = useParams()
    const fetchData = async () => {
        const groupData = await getDoc(doc(db, "userData", currentUser.uid, 'groupAccess', groupID));
        if (groupData.exists()) {
            setGroupName(groupData.data().groupName)
        }

    }
    fetchData()

    const showForm = () => {
        setformShow(!formShow)
    }
    const deleteGroup = async id => {
        const result = window.confirm("Sikker på at du vil slette gruppen?");
        if (result) {
            console.log("sletter gruppe", id);

            await deleteDoc(doc(db, "groups", id))
            await deleteDoc(doc(db, "userData", currentUser.uid, 'groupAccess', id))
            navigate('/profile/groups')
            return;
        }
    };

    const capitalize = str => {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    const { displayName, photoURL } = currentUser
    return (
        < div className='profileContainer' >
            <h1>{capitalize(groupName)}</h1>
            <p>{groupID}</p>
            <img src={photoURL ? photoURL : 'https://i.imgur.com/DvtKeuk.png'} alt={photoURL ? displayName + ' profile picture' : 'default profile picture'} className="ProfilePFP" />

            {formShow && <InviteCollaboratorForm showForm={showForm} />}
            <button className='greenBG' onClick={() => showForm()}>+ Legg til bruker</button>
            <button className='greenBorder' onClick={() => deleteGroup(groupID)}>Slett Gruppe</button>
        </div >
    )

}
