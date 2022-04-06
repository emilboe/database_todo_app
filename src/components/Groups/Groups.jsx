import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../firebase';
import Group from '../GroupItem/GroupItem';
import { query, onSnapshot } from 'firebase/firestore';



export default function Fridge() {
  const { currentUser } = useAuth()
  const [groupList, setGroupList] = useState([])

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

  useEffect(() => {
    fetchUserListID(currentUser.uid)
  }, [currentUser.uid])


  return (
    <>
      <h1>Groups</h1>
      <p>needs displayname!!, {currentUser.displayName}</p>
      {console.log('groupList', groupList)}
      {groupList.map(group => (
        <Group
          key={group.id}
          groupID={group.id}
          groupName={group.listName}
        />
      ))}
    </>
  )

}
