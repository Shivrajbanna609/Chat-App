import React, { useContext, useEffect, useState } from 'react'
import './ChatBox.css'
import assets from '../../assets/assets'
import { AppContext } from '../../context/AppContext';
import { arrayUnion, doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { toast } from 'react-toastify';

const ChatBox = () => {

  const { userData, messagesId, chatUser, messages, setMessages } = useContext(AppContext);

  const [input, setInput] = useState("");

  const sendMessage = async ()=>{

    try {
      if (input && messagesId) {
        await updateDoc(doc(db,'messages',messagesId),{
          message: arrayUnion({
            sId:userData.id,
            text:input,
            createdAt:new Date()
          })
        })
  
        const userIDs = [chatUser.rid,userData.id];
  
        userIDs.forEach(async (id) => {
          const userChatsRef = doc(db,'chats',id);
          const userChatsSnapshot = await getDoc(userChatsRef);
  
          if (userChatsSnapshot.exists()) {
            const userChatData = userChatsSnapshot.data();
            const chatIndex = userChatData.chatsData.findIndex((c)=>c.messageId === messagesId);
            userChatData.chatsData[chatIndex].lastMessage = input.slice(0,30);
            userChatData.chatsData[chatIndex].updatedAt = Date.now();
            if (userChatData.chatsData[chatIndex].rId === userData.id) {
              userChatData.chatsData[chatIndex].messageseen = false;
            }
            await updateDoc(userChatsRef,{
              chatsData:userChatData.chatsData
            })
          }
        })
      }
    } catch (error) {
      toast.error(error.message)
    }
    setInput("");
  }

  const convertTimeStamp = (timestamp) => {
    let date = timestamp.toDate();
    const hour = date.getHours();
    const minute = date.getMinutes(); 
    if (hour>12) {
      return hour-12 + ":" + minute + " PM";
    }
    else{
      return hour +":" + minute + " AM";

    }
  }


  useEffect(() => {
    if (messagesId) {
      const unSub = onSnapshot(doc(db,'messages',messagesId),(res) => {
        setMessages(res.data().message.reverse());
      })
      return () => {
        unSub();
      }
    }
  }, [messagesId])

  return chatUser ? (
    <div className='chat-box'>
      <div className="chat-user">
        <img src={assets.avatar_icon || chatUser.userData.avatar} alt="" />
        <p>{chatUser.userData.name} <img className='dot' src={assets.green_dot} alt="" /></p>
        <img src={assets.help_icon} className='help' alt="" />
      </div>


      <div className="chat-msg">

        {messages.map((msg,index)=>(
        <div key={index} className={msg.sId === userData.id ? "s-msg" : "r-msg"}>
          <p className="msg">{msg.text}</p>
          <div>
            <img src={assets.avatar_icon} alt="" />
            <p>{convertTimeStamp(msg.createdAt)}</p>
          </div>
        </div>
        ))}
      </div>



      <div className="chat-input">
        <input onChange={(e)=>setInput(e.target.value)} value={input} type="text" placeholder='Send a message' />
        <input type="file" id='image' accept='image/png, image/jpeg' hidden />
        <label htmlFor="image">
          <img src={assets.gallery_icon} alt="" />
        </label>
        <img onClick={sendMessage} src={assets.send_button} alt="" />
      </div>
    </div>
  )
    : <div className='chat-welcome'>
      <img src={assets.logo_icon} alt="" />
      <p>Chat Anytime, Anywhere</p>
    </div>
}

export default ChatBox
