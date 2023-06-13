import React, { useEffect, useState } from 'react'
import "./Chat.css"
import { user } from "../Join/Join"
import socketIO from "socket.io-client"
import Message from '../Message/Message';
import ReactScrollTOBottom from "react-scroll-to-bottom";
import close from "../../img/close.png"
import sendbtn from "../../img/send.png"
import logo from "../../img/logo.png"

let socket;
const ENDPOINT = "http://localhost:8000"

const Chat = () => {

  const [id, setId] = useState("");
  const [messages, setMessages] = useState([]);

  const send = () => {
    const message = document.getElementById("chatInput").value;
    socket.emit('message', { message, id })
    document.getElementById("chatInput").value = "";
  }

  useEffect(() => {

    socket = socketIO(ENDPOINT, { transports: ['websocket'] });

    socket.on("connect", () => {
      setId(socket.id)
    })

    socket.emit("joined", { user })

    socket.on("welcome", (data) => {
      setMessages([...messages, data])
      console.log(data.user, data.message)
    })

    socket.on("userJoined", (data) => {
      setMessages([...messages, data])
      console.log(data);
    })

    socket.on("leave", (data) => {
      setMessages([...messages, data])
      console.log(data.user, data.message)
    })

    return () => {
      socket.emit("disconnected");
      socket.off();
    }

  }, [])

  useEffect(() => {
    socket.on('sendMessage', (data) => {
      setMessages([...messages, data])
      console.log(data.user, data.message, data.id);
    })

    return () => {

    }
  }, [messages])



  return (
    <div className='chatPage'>
      <div className="chatContainer">
        <div className="header">
          <div className='logoDiv'>
            <img src={logo} alt="" />
            <h2>QuickChat</h2>
          </div>
          <a href="/">
            <img src={close} className="closeIcon" alt="" />
          </a>
        </div>
        <ReactScrollTOBottom className="chatBox">
          {
            messages.map((item, i) => {
              return <Message
                message={item.message}
                user={item.id === id ? "" : item.user}
                classs={item.id === id ? "right" : "left"}
                id={i} />
            })
          }
        </ReactScrollTOBottom>
        <div className="inputBox">
          <input onKeyPress={(e) => e.key === 'Enter' ? send() : ""} type="text" id='chatInput' />
          <button className='sendbtn' onClick={send}>
            <img src={sendbtn} alt="" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default Chat