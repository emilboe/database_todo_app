import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../firebase';
import Group from '../GroupItem/GroupItem';
import NewGroupForm from './NewGroupForm';
import { query, onSnapshot } from 'firebase/firestore';



export default function Fridge() {
  const { currentUser } = useAuth()
  const [groupList, setGroupList] = useState([])
  const [formShow, setformShow] = useState(false)

  const fetchUserListID = (uid) => {
    const q = query(db.collection('userData').doc(uid).collection('groupAccess'))
    const unsub = onSnapshot(q, (querySnapshot) => {
      let groupIDs = []
      querySnapshot.forEach((doc) => {
        groupIDs.push({ ...doc.data(), id: doc.id })
      })
      setGroupList(groupIDs)
    })
    return () => unsub()
  }
  const showForm = () => {
    setformShow(!formShow)
  }

  useEffect(() => {
    fetchUserListID(currentUser.uid)
  }, [currentUser.uid])

  //invitation: 
  // const handleSubmitInvitation = async (event) => {
  //   event.preventDefault()
  //   console.log('array and name:', collaborators, collabName)
  //   let found = false
  //   if (!collabName) {
  //     alert('no input...')
  //     return
  //   }

  //   collaborators.forEach(el => {
  //     if (el.collabName === collabName) {
  //       alert('user is already a collaborator!')
  //       found = true
  //       return
  //     }
  //   })
  //   if (!found) {
  //     try {
  //       console.log('sending data')
  //       await db.collection('invitations').doc(collabName).collection('invites').add({
  //         collabName,
  //         groupID: currentUser.uid + group,
  //         invitedBy: currentUser.displayName,
  //         groupName: group
  //       }, { merge: true })
  //       // await db.collection('groups').doc(currentUser.uid + group).collection('collaborators').add({
  //       //   collabName
  //       // }, { merge: true })
  //       alert('user invited!')
  //     }
  //     catch (err) {
  //       console.log(err)
  //     }
  //     setTitle('')
  //     return
  //   }
  // }


  return (
    <React.Fragment>
      <h1>Groups</h1>
      {console.log('groupList', groupList)}
      {groupList.map(group => (
        <Group
          key={group.id}
          groupID={group.id}
          groupName={group.groupName}
        />
      ))}
      {formShow && <NewGroupForm showForm={showForm} />}
      <button className='grassBG' onClick={() => showForm()}>+</button>
    </React.Fragment>
  )

}
