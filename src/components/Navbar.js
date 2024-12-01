import React, { useState } from 'react';
import './about.css';
import {
  Grid,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import linked from '../images/linked.png';
import home from '../images/home.png';
import message from '../images/message.png';
import network from '../images/network.png';
import aboutIcon from '../images/about.png';
import profile from '../images/profile.png';
import { Link, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { auth, database } from '../firebase/setup';

function Navbar({ userData }) {
  const navigate = useNavigate();
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const [userDetails, setUserDetails] = useState({
    username:
      userData._document?.data?.value.mapValue.fields.username.stringValue ?? '',
    designation:
      userData._document?.data?.value.mapValue.fields.designation?.stringValue ??
      '',
    phone:
      userData._document?.data?.value.mapValue.fields.phone?.stringValue ?? '',
    skills:
      userData._document?.data?.value.mapValue.fields.skills?.stringValue ?? '',
    address:
      userData._document?.data?.value.mapValue.fields.address?.stringValue ?? '',
  });

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (err) {
      console.error(err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileUpdate = async () => {
    try {
      const userId = auth.currentUser?.uid;
      const userDocRef = doc(database, 'Users', userId);

      const updatedData = {
        username:
          userDetails.username ||
          userData._document?.data?.value.mapValue.fields.username.stringValue,
        designation:
          userDetails.designation ||
          userData._document?.data?.value.mapValue.fields.designation?.stringValue,
        phone:
          userDetails.phone ||
          userData._document?.data?.value.mapValue.fields.phone?.stringValue,
        skills:
          userDetails.skills ||
          userData._document?.data?.value.mapValue.fields.skills?.stringValue,
        address:
          userDetails.address ||
          userData._document?.data?.value.mapValue.fields.address?.stringValue,
      };

      await updateDoc(userDocRef, updatedData);

      console.log('Profile updated successfully!');
      setIsPopupOpen(false);
    } catch (err) {
      console.error('Error updating profile:', err);
    }
  };

  return (
    <div style={{ padding: '10px', borderBottom: '1px solid #D6D6D6', justifyContent:"flex-end", className:"nav-icons"}}>
      <Grid container alignItems="center" justifyContent="space-between">
        <Grid item xs={1}>
        <Link to="/main">
          <img
            style={{ width: '35px', marginLeft: '80px' }}
            src={linked}
            alt="Logo"
          />
        </Link>
        </Grid>
        <Grid item xs={9} container>
  <div style={{ display: "flex", alignItems: "center", marginLeft: "auto" }}>
    <div style={{ textAlign: 'center', margin: '0 10px' }}>
            <Link to="/main">
              <img style={{ width: '35px' }} src={home} alt="Home" />
            </Link>
            <div>Home</div>
          </div>
          <div style={{ textAlign: 'center', margin: '0 10px' }}>
            <Link
              to="/connect"
              state={{username:userData._document?.data?.value.mapValue.fields.username.stringValue,
                designation:userData._document?.data?.value.mapValue.fields.designation.stringValue,
                profile_img:userData._document?.data?.value.mapValue.fields.profile_image.stringValue}} 
            >
              <img
                style={{ width: '35px'}}
                src={network}
                alt="Network"
              />
            </Link>
            <div>Network</div>
          </div>
          <div style={{ textAlign: 'center', margin: '0 10px' }}>
            <Link to="/network" state={{currentUserProImg:userData._document?.data?.value.mapValue.fields.profile_image.stringValue,
             currentUserName:userData._document?.data?.value.mapValue.fields.username.stringValue}}>
              <img style={{ width: '35px' }} src={message} alt="Messages" />
            </Link>
            <div>Messages</div>
          </div>
          <div style={{ textAlign: 'center', margin: '0 10px' }}>
            <Link to="/about">
              <img style={{ width: '35px' }} src={aboutIcon} alt="About Us" />
            </Link>
            <div>About Us</div>
          </div>
          <div style={{ textAlign: 'center', margin: '0 10px' }}>
            <img
              style={{ width: '35px', cursor: 'pointer' }}
              src={profile}
              alt="Profile"
              onClick={() => setIsPopupOpen(true)}
            />
            <div>Profile</div>
          </div>
        </div>
        </Grid>
        <Grid item xs={1}>
          <button
            onClick={handleLogout}
            style={{
              background: 'transparent',
              color: 'Black',
              border: 'none',
              borderRadius: '25px',
              padding: '8px 20px',
              fontSize: '14px',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              cursor: 'pointer',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
              transition: 'all 0.2s ease',
              justifyContent: 'flex-end',
            }}
          >
            Logout
          </button>
        </Grid>
      </Grid>

      <Dialog
        open={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent style={{ padding: '20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <TextField
              label="Username"
              name="username"
              value={userDetails.username}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              label="Designation"
              name="designation"
              value={userDetails.designation}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              label="Phone Number"
              name="phone"
              value={userDetails.phone}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              label="Skills"
              name="skills"
              value={userDetails.skills}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              label="Address"
              name="address"
              value={userDetails.address}
              onChange={handleInputChange}
              fullWidth
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsPopupOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleProfileUpdate} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Navbar;
