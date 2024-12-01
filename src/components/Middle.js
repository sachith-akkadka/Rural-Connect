import React, { useEffect, useRef, useState } from "react";
import profile from "../images/profile.png";
import { Card, CardContent, Typography, Button } from "@mui/material";
import { collection, doc, getDocs, deleteDoc } from "firebase/firestore";
import { auth, database } from "../firebase/setup";
import Post from "./Post";

function Middle({ userData }) {
  const postRef = useRef(null);
  const [posts, setPosts] = useState([]);
  const [myPosts, setMyPosts] = useState([]);
  const [allPosts, setAllPosts] = useState([]);
  const [isViewingMyPosts, setIsViewingMyPosts] = useState(true);

  const getMyPosts = async () => {
    try {
      const userDoc = doc(database, "Users", `${auth.currentUser?.uid}`);
      const postsRef = collection(userDoc, "Posts");
      const data = await getDocs(postsRef);
      const postList = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setMyPosts(postList);
      if (isViewingMyPosts) {
        setPosts(postList); // Ensure posts update when viewing "My Posts"
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getAllPosts = async () => {
    try {
      const globalPostsRef = collection(database, "jobs");
      const data = await getDocs(globalPostsRef);
      const allPostsList = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setAllPosts(allPostsList);
    } catch (err) {
      console.error(err);
    }
  };

  const deletePost = async (postId) => {
    try {
      const userPostRef = doc(
        database,
        "Users",
        `${auth.currentUser?.uid}`,
        "Posts",
        postId
      );
      await deleteDoc(userPostRef);

      const globalPostRef = doc(database, "jobs", postId);
      await deleteDoc(globalPostRef);

      const updatedPosts = myPosts.filter((post) => post.id !== postId);
      setMyPosts(updatedPosts);
      if (isViewingMyPosts) {
        setPosts(updatedPosts);
      }
    } catch (err) {
      console.error("Error deleting post:", err);
    }
  };

  useEffect(() => {
    getMyPosts();
    getAllPosts();
  }, []);

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      {/* Toggle Buttons */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "20px",
          gap: "15px",
        }}
      >
        <Button
          variant={isViewingMyPosts ? "contained" : "outlined"}
          onClick={() => {
            setIsViewingMyPosts(true);
            getMyPosts(); // Fetch posts when switching back to "My Posts"
          }}
          style={{ padding: "10px 20px", fontWeight: "bold" }}
        >
          My Posts
        </Button>
        <Button
          variant={!isViewingMyPosts ? "contained" : "outlined"}
          onClick={() => {
            setIsViewingMyPosts(false);
            setPosts(allPosts); // Show All Posts
          }}
          style={{ padding: "10px 20px", fontWeight: "bold" }}
        >
          All Posts
        </Button>
      </div>

      {/* Create Post Section */}
      {isViewingMyPosts && (
        <div
          style={{
            backgroundColor: "#f9f9f9",
            padding: "20px",
            borderRadius: "12px",
            boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
            display: "flex",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <img
            style={{ width: "60px", borderRadius: "50%" }}
            src={
              userData?._document?.data?.value.mapValue.fields.profile_image
                ?.stringValue ?? profile
            }
            alt="Profile"
          />
          <button
            onClick={() => postRef.current?.click()}
            style={{
              marginLeft: "20px",
              padding: "10px 20px",
              backgroundColor: "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: "5px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Create a Post
          </button>
          <Post ref={postRef} onPostCreated={getMyPosts} />
        </div>
      )}

      {/* Display Posts Section */}
      <div style={{ paddingTop: "20px" }}>
        {posts.map((post) => (
          <Card
            sx={{
              mt: "15px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              borderRadius: "12px",
            }}
            key={post.id}
          >
            <CardContent>
              <div style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
                <img
                  src={post.profile_image ?? profile}
                  style={{
                    width: "50px",
                    borderRadius: "50%",
                    marginRight: "15px",
                  }}
                  alt="Profile"
                />
                <div>
                  <Typography variant="h6" style={{ fontWeight: "bold" }}>
                    {post.username || "Anonymous"}
                  </Typography>
                  <Typography sx={{ color: "#757575", fontSize: "14px" }}>
                    {post.designation || ""}
                  </Typography>
                </div>
              </div>
              <Typography variant="h5" sx={{ mt: "10px", fontWeight: "bold" }}>
                {post.skill_original}
              </Typography>
              <Typography variant="body2" sx={{ color: "#616161", mt: "5px" }}>
                {post.location_original}
              </Typography>
              <Typography variant="body1" sx={{ mt: "10px", lineHeight: "1.6" }}>
                {post.description}
              </Typography>
              <Typography
                variant="body1"
                sx={{ mt: "10px", color: "#424242", fontWeight: "bold" }}
              >
                Contact: {post.mobile}
              </Typography>
              {isViewingMyPosts && (
                <Button
                  variant="contained"
                  color="error"
                  size="small"
                  onClick={() => deletePost(post.id)}
                  style={{ marginTop: "15px" }}
                >
                  Delete
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default Middle;