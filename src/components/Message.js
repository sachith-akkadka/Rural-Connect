import { Button, List, ListItem, Paper, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { addDoc, collection, doc, getDocs, deleteDoc } from 'firebase/firestore';
import { auth, database } from '../firebase/setup';
import { useLocation } from 'react-router-dom';

function Message() {
  const location = useLocation();

  const [message, setMessage] = useState('');
  const [messageData, setMessageData] = useState([]);

  const addMessage = async () => {
    const userDoc = doc(database, 'Users', `${auth.currentUser?.uid}`);
    const messageDoc = doc(userDoc, 'Message', `${auth.currentUser?.uid}`);
    const messageRef = collection(messageDoc, `Message-${location.state.id}`);
    try {
      await addDoc(messageRef, {
        message: message,
        username: location.state.currentUserName,
        profile_image: location.state.currentProImg,
      });
    } catch (err) {
      console.error(err);
    }
  };

  const sendMessage = async () => {
    const userDoc = doc(database, 'Users', `${location.state.id}`);
    const messageDoc = doc(userDoc, 'Message', `${location.state.id}`);
    const messageRef = collection(messageDoc, `Message-${auth.currentUser?.uid}`);
    try {
      await addDoc(messageRef, {
        message: message,
        username: location.state.currentUserName,
        profile_image: location.state.currentProImg,
      });
      addMessage();
      setMessage(''); // Clear input after sending
    } catch (err) {
      console.error(err);
    }
  };

  const deleteMessage = async (messageId) => {
    const userDoc = doc(database, 'Users', `${auth.currentUser?.uid}`);
    const messageDoc = doc(userDoc, 'Message', `${auth.currentUser?.uid}`);
    const messageRef = doc(messageDoc, `Message-${location.state.id}`, messageId);
    try {
      await deleteDoc(messageRef);
      showMessage(); // Refresh messages after deletion
    } catch (err) {
      console.error(err);
    }
  };

  const showMessage = async () => {
    const userDoc = doc(database, 'Users', `${auth.currentUser?.uid}`);
    const messageDoc = doc(userDoc, 'Message', `${auth.currentUser?.uid}`);
    const messageRef = collection(messageDoc, `Message-${location.state.id}`);
    try {
      const data = await getDocs(messageRef);
      const filteredData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setMessageData(filteredData);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    showMessage();
  }, []);

  return (
    <div style={{ padding: '30px' }}>
      <Paper>
        <List>
          <ListItem>
            <div>
              <TextField
                onChange={(e) => setMessage(e.target.value)}
                value={message}
                variant="outlined"
                label="Type here"
                size="small"
              />
              <Button onClick={sendMessage} sx={{ ml: '30px' }} variant="contained">
                Send
              </Button>
            </div>
          </ListItem>
        </List>
      </Paper>

      <div>
        {messageData.map((userMessage) => (
          <div key={userMessage.id} style={{ marginBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <img
                style={{ width: '30px', height: '30px', borderRadius: '40px' }}
                src={userMessage.profile_image}
                alt="Profile"
              />
              <h5 style={{ marginLeft: '10px' }}>{userMessage.username}</h5>
              <Button
                onClick={() => deleteMessage(userMessage.id)}
                variant="text"
                color="error"
                size="small"
                sx={{ ml: 'auto' }}
              >
                Delete
              </Button>
            </div>
            <h5 style={{ marginLeft: '30px', fontWeight: '100' }}>{userMessage.message}</h5>
          </div>
        ))}
      </div>
      <footer
        style={{
          backgroundColor: 'transparent',
          color: 'Black',
          textAlign: 'center',
          padding: '5px',
          fontSize: '18px',
        }}
      >
        <p>
          <b>© 2024 Rural Connect. All rights reserved.</b>
        </p>
      </footer>
    </div>
  );
}

export default Message;
