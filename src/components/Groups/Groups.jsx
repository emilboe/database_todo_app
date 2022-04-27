import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../firebase';
import Group from '../GroupItem/GroupItem';
import NewGroupForm from './NewGroupForm';
import { query, onSnapshot } from 'firebase/firestore';
import '../GroupDetail/Groups.css';



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

  return (
    <React.Fragment>
      <main className="groupsMain">
        {groupList.map(group => (
          <Group
            key={group.id}
            groupID={group.id}
            groupName={group.groupName}
          />
        ))}
        {formShow && <NewGroupForm showForm={showForm} />}
        <button className='greenBG addGroupButton' onClick={() => showForm()}> + Lag ny gruppe</button>
      </main>
    </React.Fragment>
  )

}
