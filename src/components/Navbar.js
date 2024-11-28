import React, { useState } from 'react';
import { Grid, TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import linked from "../images/linked.png";
import lens from "../images/lens.png";
import home from "../images/home.png";
import message from "../images/message.png";
import network from "../images/network.png";
import profile from "../images/profile.png";
import { Link, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { auth, database } from '../firebase/setup';

function Navbar({ userData }) {
  const navigate = useNavigate();
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const [userDetails, setUserDetails] = useState({
    profileImage: userData._document?.data?.value.mapValue.fields.profile_image.stringValue ?? profile,
    username: userData._document?.data?.value.mapValue.fields.username.stringValue ?? '',
    designation: userData._document?.data?.value.mapValue.fields.designation?.stringValue ?? '',
    phone: userData._document?.data?.value.mapValue.fields.phone?.stringValue ?? '',
    skills: userData._document?.data?.value.mapValue.fields.skills?.stringValue ?? '',
    address: userData._document?.data?.value.mapValue.fields.address?.stringValue ?? '',
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
      const userId = auth.currentUser?.uid; // Use UID of the logged-in user
      const userDocRef = doc(database, "Users", userId); // Reference to Firestore document

      // Update the fields only if new values are provided
      const updatedData = {
        profile_image: userDetails.profileImage || userData._document?.data?.value.mapValue.fields.profile_image.stringValue,
        username: userDetails.username || userData._document?.data?.value.mapValue.fields.username.stringValue,
        designation: userDetails.designation || userData._document?.data?.value.mapValue.fields.designation.stringValue,
        phone: userDetails.phone || userData._document?.data?.value.mapValue.fields.phone.stringValue,
        skills: userDetails.skills || userData._document?.data?.value.mapValue.fields.skills.stringValue,
        address: userDetails.address || userData._document?.data?.value.mapValue.fields.address.stringValue,
      };

      await updateDoc(userDocRef, updatedData);

      console.log('Profile updated successfully!');
      setIsPopupOpen(false); // Close the modal after saving
    } catch (err) {
      console.error('Error updating profile:', err);
    }
  };

  return (
    <div style={{ padding: '10px', borderBottom: '1px solid #D6D6D6' }}>
      <Grid container>
        <Grid item xs={5}>
          <img style={{ width: '35px', marginLeft: '80px' }} src={linked} alt="Logo" />
        </Grid>
        <Grid item xs={6}>
          <Link to="/main">
            <img style={{ width: '35px', marginLeft: '20px' }} src={home} alt="Home" />
          </Link>
          <Link to="/network">
            <img style={{ width: '35px', marginLeft: '50px' }} src={network} alt="Network" />
          </Link>
          <Link to="/message">
            <img style={{ width: '35px', marginLeft: '50px' }} src={message} alt="Messages" />
          </Link>
          <img
            style={{ width: '35px', marginLeft: '50px', borderRadius: '40px', cursor: 'pointer' }}
            src={userDetails.profileImage}
            alt="Profile"
            onClick={() => setIsPopupOpen(true)}
          />
        </Grid>
        <Grid item xs={1}>
          <button
            onClick={handleLogout}
            style={{
              background: 'linear-gradient(90deg, #ff8a00, #e52e71)',
              color: 'white',
              border: 'none',
              borderRadius: '25px',
              padding: '8px 20px',
              fontSize: '14px',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              cursor: 'pointer',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)',
              transition: 'all 0.3s ease',
            }}
          >
            Logout
          </button>
        </Grid>
      </Grid>

      {/* Profile Edit Popup */}
      <Dialog open={isPopupOpen} onClose={() => setIsPopupOpen(false)} maxWidth="lg" fullWidth>
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
            <Button variant="contained" component="label">
              Upload Profile Image
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = () => {
                      setUserDetails((prev) => ({ ...prev, profileImage: reader.result }));
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
            </Button>
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