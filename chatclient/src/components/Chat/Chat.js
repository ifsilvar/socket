import React, { useState, useEffect } from "react";
import ReactDOM from 'react-dom';
import io from "socket.io-client";
import './Chat.css'

const username = prompt('What is your name');

// add  "proxy": "http://localhost:3001", to package.json

const socket = io("http://localhost:3001", {
    transports: ["websocket", "polling"]
})

const Chat = ({}) => {
    const [users, setUsers] = useState([]);
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);


        //include server address if not served on the same domain
        // var socket = io('http://localhost:3000');

        // var messages = document.getElementById('messages');
        // var form = document.getElementById('form');
        // var input = document.getElementById('input');
  
          // const name = prompt('What is your name?')
          // appendMessage('You joined')
          // socket.emit('new-user', name)
  
        // form.addEventListener('submit', function(e) {
        //   e.preventDefault();
        //   if (input.value) {
        //     socket.emit('chat message', input.value);
        //     input.value = '';
        //   }
        // });
        //captures event from server
        useEffect(() => {
            socket.on("connect", () => {
                socket.emit("new-user", username);
                });

            //adds each new user to the existing users array
            socket.on("connected", user => {
                setUsers(users => [...users, user]);
            });

            //set users array 
            socket.on("users", users => {
                setUsers(users);
              });

            socket.on('chat message', (msg) => {
                console.log(msg)
                setMessages([...messages, msg])
            });

        }, [messages]);
        
        const handleSend = () => {
            socket.emit('chat message', message);
            console.log("new msg")
            setMessage("")
        }

        return (
            <div>
                <div>
                    <h1>Hello {username}</h1>
                </div>
                <ul>
                    {messages.map(({user, text}, index) => (<li key={index}>{user.name}: {text}</li>))}
                </ul>
                <input value={message} type="text" onSubmit={handleSend} onChange={(event) => setMessage(event.target.value)} />
                <button onClick={handleSend}>Send</button>
            </div>
        )

}

export default Chat; 