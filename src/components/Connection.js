import { collection, doc, getDocs, setDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { auth, database } from '../firebase/setup';
import { Avatar, Button, List, ListItem, ListItemText, Paper, Typography, Box } from '@mui/material';
import { useLocation, Link } from 'react-router-dom';
import HomeIcon from '../images/home.png'; // Import Home Icon
import linked from '../images/linked.png'; // Import Logo

function Connection() {
  const location = useLocation();
  const [userData, setUserData] = useState([]);

  const getUsers = async () => {
    const userRef = collection(database, 'Users');
    try {
      const data = await getDocs(userRef);
      const filteredData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setUserData(filteredData);
    } catch (err) {
      console.error(err);
    }
  };

  const sendRequest = async (userId) => {
    const requestDoc = doc(database, 'Users', `${userId}`);
    const connectRef = doc(requestDoc, 'RequestIn', `${auth.currentUser?.uid}`);
    try {
      await setDoc(connectRef, {
        username: location.state.username,
        designation: location.state.designation,
        profile_image: location.state.profile_img,
        id: auth.currentUser?.uid,
        status: 'pending',
      });
      setUserData((prevUsers) => prevUsers.filter((user) => user.id !== userId)); // Remove user from the list
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <div style={{ padding: '20px', backgroundColor: '#F6F7F3', height: '100vh' }}>
      {/* Logo linking to the home page */}
      <div style={{ position: 'absolute', top: '10px', left: '10px' }}>
        <Link to="/main">
          <img src={linked} alt="Logo" style={{ width: '50px', marginBottom: '20px' }} />
        </Link>
      </div>

      <div style={{ marginTop: '70px' }}>
        {userData.filter((user) => user.id !== auth.currentUser?.uid).length === 0 ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '60vh',
            }}
          >
            <Typography variant="h6" color="textSecondary" align="center" paragraph>
              <strong>No users available to connect</strong>
            </Typography>
            <Link to="/main" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
              <img src={HomeIcon} style={{ width: '28px', height: '28px', marginRight: '10px' }} alt="Home" />
              <Typography variant="body1" color="black">
                Go to Home
              </Typography>
            </Link>
          </Box>
        ) : (
          userData
            .filter((user) => user.id !== auth.currentUser?.uid)
            .map((otherUser) => (
              <Paper
                key={otherUser.id}
                style={{
                  marginBottom: '10px',
                  padding: '10px',
                  marginLeft: '10px',
                  marginRight: '10px',
                }}
              >
                <List>
                  <ListItem>
                    <Avatar src={otherUser.profile_image} />
                    <ListItemText primary={otherUser.username} secondary={otherUser.designation} />
                    <Button
                      onClick={() => sendRequest(otherUser.id)}
                      variant="outlined"
                      size="small"
                      sx={{ ml: '10px' }}
                    >
                      Connect
                    </Button>
                  </ListItem>
                </List>
              </Paper>
            ))
        )}
      </div>
    </div>
  );
}

export default Connection;