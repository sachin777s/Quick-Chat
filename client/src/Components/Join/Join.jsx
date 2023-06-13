import React, { useState } from 'react'
import "./Join.css"
import logo from "../../img/logo.png"
import { Link } from 'react-router-dom'

let user;

const sendUser = () => {
  user = document.getElementById('joinInput').value;
  document.getElementById('joinInput').value = "";
}

const Join = () => {

  const [name, setName] = useState("");
  console.log(name)

  return (
    <div className="joinPage">
      <div className="joinContainer">
        <img src={logo} alt="" />
        <h1>JOIN PAGE</h1>
        <input onChange={(e) => setName(e.target.value)} type="text" id='joinInput' placeholder='Enter Your Name' />
        <Link onClick={(e) => !name? e.preventDefault() : null} to="/chat">
          <button className='joinbtn' onClick={sendUser}>Join</button>
        </Link>
      </div>
    </div>
  )
}

export default Join;
export { user }