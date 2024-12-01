import React, { useEffect, useState } from 'react';
import { auth, database } from '../firebase/setup';
import { collection, doc, getDocs } from 'firebase/firestore';
import { Avatar, Button, List, ListItem, ListItemText, Paper, Typography, Box } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import HomeIcon from '../images/home.png'; // Import Home Icon
import linked from '../images/linked.png'; // Import Logo

function Network() {
  const location = useLocation();
  const [user, setUser] = useState([]);

  const showRequest = async () => {
    const requestRef = doc(database, 'Users', `${auth.currentUser?.uid}`);
    const requestInRef = collection(requestRef, 'RequestIn');
    try {
      const data = await getDocs(requestInRef);
      const filteredData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setUser(filteredData);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    showRequest();
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
        {user.filter((user) => user.status === 'connected').length === 0 ? (
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
              <strong>No connections found</strong>
            </Typography>
            <Link to="/main" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
              <img src={HomeIcon} style={{ width: '28px', height: '28px', marginRight: '10px' }} alt="Home" />
              <Typography variant="body1" color="black">
                Go to Home
              </Typography>
            </Link>
          </Box>
        ) : (
          user
            .filter((user) => user.status === 'connected')
            .map((eachUser) => (
              <Paper
                key={eachUser.id}
                style={{
                  marginBottom: '10px',
                  padding: '10px',
                  marginLeft: '10px',
                  marginRight: '10px',
                }}
              >
                <List>
                  <ListItem>
                    <Avatar src={eachUser.profile_image} />
                    <ListItemText primary={eachUser.username} secondary={eachUser.designation} />
                    <Link
                      to="/message"
                      state={{
                        currentUserName: location.state.currentUserName,
                        currentProImg: location.state.currentUserProImg,
                        username: eachUser.username,
                        id: eachUser.id,
                        profile_image: eachUser.profile_image,
                      }}
                      style={{ textDecoration: 'none' }}
                    >
                      <Button variant="outlined" size="small" sx={{ ml: '10px' }}>
                        Message
                      </Button>
                    </Link>
                  </ListItem>
                </List>
              </Paper>
            ))
        )}
      </div>
    </div>
  );
}

export default Network;
