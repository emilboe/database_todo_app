import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../firebase';
import { query, onSnapshot, getDocs } from 'firebase/firestore';

export default function CurrentGroup(props) {
  const { groupID, setGroupID } = props
  console.log('groupID from currentGroup: ', groupID)
  const { currentUser } = useAuth()
  const [groupList, setGroupList] = useState([])
  const [groupName, setGroupName] = useState('')
  const [value, setValue] = useState(groupID);


  const fetchGroupAccessList = async () => {
    const q = query(db.collection('userData').doc(currentUser.uid).collection('groupAccess'))
    const querySnapshot = await getDocs(q)
    let groupListArray = []
    querySnapshot.forEach((doc) => {
      groupListArray.push({ ...doc.data(), id: doc.id })
    })
    setGroupList(groupListArray)
    console.log('groupListArray', groupListArray)
    setGroupID(groupListArray[0].id)
  }

  const fetchGroupName = (id) => {
    const q = query(db.collection('userData').doc(currentUser.uid).collection('groupAccess').doc(id))
    const unsub = onSnapshot(q, (querySnapshot) => {
      setGroupName(querySnapshot.data().groupName)
    })
    return () => unsub()
  }

  useEffect(() => {
    fetchGroupAccessList()
    if (groupID) fetchGroupName(groupID)
    console.log('groupList :', groupList)
    if (groupList[0]) setGroupID(groupList[0].id)
  }, [])


  const handleChange = (event) => {
    setValue(event.target.value);
    setGroupID(event.target.value)
  };

  return (
    <section className='currentGroup'>
      <img src={currentUser.photoURL ? currentUser.photoURL : 'https://i.imgur.com/DvtKeuk.png'} alt={currentUser.photoURL ? currentUser.displayName + ' profile picture' : 'default profile picture'} className="pfp" />

      <form>
        <select name="groups" id="groups" value={value} onChange={handleChange}>
          {
            groupList.map(todo => (
              <option key={todo.id} value={todo.id}>{todo.groupName}</option>
            ))
          }
        </select>
      </form>
    </section >
  )

}
