import React, { forwardRef, useState, useEffect } from "react";
import { Button, TextField } from "@mui/material";
import Modal from "react-modal";
import { setDoc, doc, getDoc } from "firebase/firestore";
import { auth, database } from "../firebase/setup";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width: "400px",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
  },
};

function Post(props, ref) {
  const [modalIsOpen, setIsOpen] = useState(false);
  const [skill, setSkill] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [mobile, setMobile] = useState("");
  const [userData, setUserData] = useState({});

  const openModal = () => setIsOpen(true);
  const closeModal = () => {
    setSkill("");
    setLocation("");
    setDescription("");
    setMobile("");
    setIsOpen(false);
  };

  const getUser = async () => {
    try {
      const userDocument = doc(database, "Users", "${auth.currentUser?.uid}");
      const data = await getDoc(userDocument);
      if (data.exists()) setUserData(data.data());
    } catch (err) {
      console.error("Error fetching user data:", err);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  const addPost = async () => {
    const postDocument = doc(database, "Users", "${auth.currentUser?.uid}");
    const postId = "${Math.random()}.substring(2)"; // Generate a unique ID for the post
    const postRef = doc(postDocument, "Posts", postId);

    const postData = {
      skill,
      location,
      description,
      mobile,
      username: userData?.username || "Anonymous",
      profile_image: userData?.profile_image || "",
    };

    try {
      // Save to user's Posts subcollection
      await setDoc(postRef, postData);

      // Save to global jobs collection
      const globalJobRef = doc(database, "jobs", postId);
      await setDoc(globalJobRef, postData);

      props.onPostCreated(); // Refresh posts in Middle.js
      closeModal();
    } catch (err) {
      console.error("Error adding post:", err);
    }
  };

  return (
    <div>
      <button ref={ref} onClick={openModal} style={{ display: "none" }}>
        Open Modal
      </button>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Create Post Modal"
      >
        <h2 style={{ marginBottom: "15px" }}>Create a Post</h2>
        <TextField
          label="Skill"
          value={skill}
          onChange={(e) => setSkill(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Description"
          multiline
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Mobile Number"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          fullWidth
          margin="normal"
        />
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "15px" }}>
          <Button variant="outlined" onClick={closeModal}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={addPost}
            style={{ marginLeft: "10px" }}
          >
            Post
          </Button>
        </div>
      </Modal>
    </div>
  );
}

export default forwardRef(Post);