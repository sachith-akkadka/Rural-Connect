import React, { useState } from 'react';
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider, database, storage } from '../firebase/setup';
import { doc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import linkedin from '../images/linkedin.png';
import background from '../images/grass-bg.jpg';
import 'react-toastify/dist/ReactToastify.css';

function Signin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [open, setOpen] = useState(false); // Popup dialog state for signup
  const [profileImage, setProfileImage] = useState(null); // Profile image state
  const [signupData, setSignupData] = useState({
    name: '',
    designation: '',
    skills: '',
    address: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password || !username || !designation || !profileImage) {
      alert("Please fill in all mandatory fields.");
      return;
    }
  
    try {
      // Add user data to Firestore
      await setDoc(doc(database, "Users", userId), {
        username,
        designation,
        email,
        phone,
        address,
        profile_image: profileImage,
        skills: skills || "", // Make skills optional
      });
      alert("Signup successful!");
    } catch (err) {
      console.error(err);
      alert("Error signing up. Please try again.");
    }
  };
  
  // Handle sign-in with email/password
  const handleSignIn = async (email, password) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      toast.success(`Welcome back, ${result.user.email}!`);
      navigate('/main'); // Redirect to /main
    } catch (err) {
      toast.error('Invalid email or password. Please try again.');
    }
  };

  // Handle Google Sign-in
  const signInwithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const userRef = doc(database, 'Users', result.user.uid);
      await setDoc(userRef, {
        username: result.user.displayName,
        email: result.user.email,
        designation: 'N/A',
        profile_image: result.user.photoURL,
      });
      navigate('/main'); // Redirect to /main
    } catch (err) {
      toast.error('Google sign-in failed.');
    }
  };

  // Handle signup popup submission
  const handleSignup = async () => {
    const { email, password, confirmPassword, ...restData } = signupData;

    // Check if profile image is uploaded
    if (!profileImage) {
      toast.error("Please upload a profile picture.");
      return;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    // Simple password validation
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }
    if (!/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
      toast.error("Password must include one lowercase letter, one uppercase letter, and one numeric character.");
      return;
    }

    try {
      // Create user in Firebase Authentication
      const result = await createUserWithEmailAndPassword(auth, email, password);

      // Upload profile image to Firebase Storage
      const storageRef = ref(storage, `profile_images/${profileImage.name}`);
      const uploadSnapshot = await uploadBytes(storageRef, profileImage);
      const profileImageUrl = await getDownloadURL(uploadSnapshot.ref);

      // Add user details to Firestore database
      const userRef = doc(database, 'Users', result.user.uid);
      await setDoc(userRef, {
        ...restData,
        email,
        profile_image: profileImageUrl,
        skills: restData.skills || "", // Make skills optional
      });

      toast.success("Signup successful. Please log in.");
      setOpen(false); // Close the signup dialog
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        toast.error("Account already exists. Please sign in.");
      } else {
        toast.error("Signup failed. Please try again.");
      }
    }
  };

  return (
    <div
      style={{
        backgroundImage: `url(${background})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <ToastContainer autoClose={2000} position="top-right" />
      <div
        style={{
          padding: '60px 40px',
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          borderRadius: '10px',
          textAlign: 'center',
        }}
      >
        <img style={{ width: '80px' }} src={linkedin} alt="LinkedIn Logo" />
        <h1 style={{ fontSize: '40px', color: '#FFFFFF', marginTop: '20px' }}>
          Welcome to Rural Connect
        </h1>
        <TextField
          onChange={(e) => setEmail(e.target.value)}
          variant="outlined"
          label="Email"
          sx={{ width: '100%', mt: '20px', backgroundColor: 'white' }}
        />
        <TextField
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          variant="outlined"
          label="Password"
          sx={{ width: '100%', mt: '20px', backgroundColor: 'white' }}
        />
        <Button
          onClick={() => handleSignIn(email, password)}
          size="large"
          variant="contained"
          sx={{
            width: '100%',
            borderRadius: '50px',
            mt: '20px',
            backgroundColor: '#4CAF50',
          }}
        >
          Sign In
        </Button>
        <p style={{ color: '#FFFFFF', margin: '15px 0' }}>OR</p>
        <Button
          onClick={signInwithGoogle}
          size="large"
          variant="contained"
          sx={{
            width: '100%',
            borderRadius: '50px',
            backgroundColor: '#4285F4',
          }}
        >
          Sign In with Google
        </Button>
        <p
          style={{
            color: '#FFFFFF',
            marginTop: '20px',
            cursor: 'pointer',
            textDecoration: 'underline',
          }}
          onClick={() => setOpen(true)}
        >
          Don't have an account? Sign Up
        </p>
      </div>

      {/* Signup Popup Dialog */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        sx={{
          "& .MuiDialog-paper": {
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            width: '500px',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: 'none',
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 'bold', fontSize: '1.5rem' }}>Sign Up</DialogTitle>
        <DialogContent>
          <Typography sx={{ fontWeight: 'bold', marginBottom: '8px' }}>
            Password must contain:
          </Typography>
          <ul>
            <li><strong>At least 6 characters</strong></li>
            <li><strong>One uppercase letter</strong></li>
            <li><strong>One lowercase letter</strong></li>
            <li><strong>One numeric character</strong></li>
          </ul>
          <TextField
            label="Name"
            onChange={(e) =>
              setSignupData({ ...signupData, name: e.target.value })
            }
            fullWidth
            margin="dense"
          />
          <TextField
            label="Designation"
            onChange={(e) =>
              setSignupData({ ...signupData, designation: e.target.value })
            }
            fullWidth
            margin="dense"
          />
          <TextField
            label="Skills"
            onChange={(e) =>
              setSignupData({ ...signupData, skills: e.target.value })
            }
            fullWidth
            margin="dense"
          />
          <TextField
            label="Address"
            onChange={(e) =>
              setSignupData({ ...signupData, address: e.target.value })
            }
            fullWidth
            margin="dense"
          />
          <TextField
            label="Phone"
            onChange={(e) =>
              setSignupData({ ...signupData, phone: e.target.value })
            }
            fullWidth
            margin="dense"
          />
          <TextField
            label="Email"
            type="email"
            onChange={(e) =>
              setSignupData({ ...signupData, email: e.target.value })
            }
            fullWidth
            margin="dense"
          />
          <TextField
            label="Password"
            type="password"
            onChange={(e) =>
              setSignupData({ ...signupData, password: e.target.value })
            }
            fullWidth
            margin="dense"
          />
          <TextField
            label="Confirm Password"
            type="password"
            onChange={(e) =>
              setSignupData({ ...signupData, confirmPassword: e.target.value })
            }
            fullWidth
            margin="dense"
          />
          <Button
            variant="contained"
            component="label"
            fullWidth
            sx={{
              backgroundColor: "#4CAF50",
              color: "#FFF",
              marginTop: "15px",
            }}
          >
            Upload Profile Picture
            <input
              type="file"
              hidden
              onChange={(e) => setProfileImage(e.target.files[0])}
            />
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="error">
            Cancel
          </Button>
          <Button onClick={handleSignup} color="primary">
            Sign Up
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Signin;