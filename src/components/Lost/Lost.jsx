import React from 'react';
import { useNavigate } from 'react-router-dom'

export default function Lost() {
  const navigate = useNavigate()
  return <div>
    <h1>404</h1>
    <p>seems, like you've made a wrong move...</p>
    <button 
    className='greenBorder'
    onClick={() => {
      navigate(-1)
      console.log('going back?')
    }
    }>Go back?</button>
  </div>;
}
