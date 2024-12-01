import React, { useEffect, useState } from 'react';
import { Avatar, Button, List, ListItem, ListItemText, Paper, Typography, Box } from '@mui/material';
import { collection, deleteDoc, doc, getDocs, setDoc } from 'firebase/firestore';
import { auth, database } from '../firebase/setup';
import { useLocation, Link } from 'react-router-dom';
import HomeIcon from '../images/home.png'; // Import Home Icon
import linked from '../images/linked.png'; // Import Logo

function Invitation() {
  const location = useLocation();
  const [user, setUser] = useState([]);

  const showrequest = async () => {
    const requestRef = doc(database, "Users", `${auth.currentUser?.uid}`);
    const requestInRef = collection(requestRef, "RequestIn");
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

  const deleteReq = async (selectedUser) => {
    const userDoc = doc(database, "Users", `${auth.currentUser?.uid}`);
    const delDocument = doc(userDoc, "RequestIn", `${selectedUser.id}`);
    try {
      await deleteDoc(delDocument);
      setUser((prevUsers) => prevUsers.filter((user) => user.id !== selectedUser.id)); // Remove the user from the state
    } catch (err) {
      console.error(err);
    }
  };

  const addConnect = async (user) => {
    const acceptDoc = doc(database, "Users", `${user.id}`);
    const connectionDoc = doc(acceptDoc, "RequestIn", `${auth.currentUser.uid}`);
    try {
      await setDoc(connectionDoc, {
        designation: location.state.designation,
        username: location.state.username,
        profile_image: location.state.profile_img,
        status: "connected",
      });
    } catch (err) {
      console.error(err);
    }
  };

  const acceptReq = async (selectedUser) => {
    const acceptDoc = doc(database, "Users", `${auth.currentUser?.uid}`);
    const connectionDoc = doc(acceptDoc, "RequestIn", `${selectedUser.id}`);
    try {
      await setDoc(connectionDoc, {
        designation: selectedUser.designation,
        username: selectedUser.username,
        profile_image: selectedUser.profile_image,
        id: selectedUser.id,
        status: "connected",
      });
      addConnect(selectedUser);
      setUser((prevUsers) => prevUsers.filter((user) => user.id !== selectedUser.id)); // Remove the user from the state
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    showrequest();
  }, []);

  return (
<div style={{ padding: "20px", backgroundColor: "#F6F7F3", height: "100vh" }}>
  {/* Add the logo to the top left corner */}
  <div style={{ position: "absolute", top: "10px", left: "10px" }}>
    <Link to="/main">
      <img src={linked} alt="Logo" style={{ width: "50px", marginBottom: "20px" }} />
    </Link>
  </div>

  {/* Conditional rendering for invitations */}
  <div style={{ marginTop: "70px" }}> {/* Ensures space below the logo */}
    {user.filter((user) => user.status === "pending").length === 0 ? (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "60vh",
        }}
      >
        <Typography variant="h6" color="textSecondary" align="center" paragraph>
          <strong>No new invitations</strong>
        </Typography>
        <Link to="/main" style={{ textDecoration: "none", display: "flex", alignItems: "center" }}>
          <img src={HomeIcon} style={{ width: "28px", height: "28px", marginRight: "10px" }} alt="Home" />
          <Typography variant="body1" color="black">
            Go to Home
          </Typography>
        </Link>
      </Box>
    ) : (
      user.filter((user) => user.status === "pending").map((eachUser) => (
        <Paper
          key={eachUser.id}
          style={{
            marginBottom: "10px",
            padding: "10px",
            marginLeft: "10px",
            marginRight: "10px",
          }}
        >
          <List>
            <ListItem>
              <Avatar src={eachUser.profile_image} />
              <ListItemText primary={eachUser.username} secondary={eachUser.designation} />
              <Button onClick={() => deleteReq(eachUser)} sx={{ color: "grey" }} size="small">
                Ignore
              </Button>
              <Button onClick={() => acceptReq(eachUser)} sx={{ ml: "5px" }} variant="outlined" size="small">
                Accept
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

export default Invitation;