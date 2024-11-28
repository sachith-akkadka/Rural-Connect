import React from 'react'
import reactjs from "../images/reactjs.png"
import profile from "../images/profile.png"
import { Link } from 'react-router-dom'

function Sidebar({ userData }) {
  // Extract user data
  const username = userData._document?.data?.value.mapValue.fields.username.stringValue ?? '';
  const profileImage = userData._document?.data?.value.mapValue.fields.profile_image.stringValue ?? profile;
  const designation = userData._document?.data?.value.mapValue.fields.designation.stringValue ?? '';
  const phone = userData._document?.data?.value.mapValue.fields.phone?.stringValue ?? '';
  const address = userData._document?.data?.value.mapValue.fields.address?.stringValue ?? '';
  
  // Assuming there is a field for new invitations or a count of new invitations
  const newInvitationsCount = userData._document?.data?.value.mapValue.fields.new_invitations_count?.integerValue ?? 0;

  return (
    <div style={{ backgroundColor: "white", border: "1px solid #D6D6D6", width: "230px", height: "420px", borderRadius: "10px", marginLeft: "55px" }}>
      <img style={{ height: "65px", width: "230px", borderTopRightRadius: "10px", borderTopLeftRadius: "10px" }} src={reactjs} alt="ReactJS logo" />
      
      <div style={{ textAlign: "center" }}>
        <img src={profileImage} style={{ width: "65px", borderRadius: "40px" }} alt="Profile" />
        <h3>{username}</h3>
      </div>

      <h4 style={{ color: "#6F6F6F", 
        textAlign: "center" 
        }}>{designation}</h4>

      {/* Display Phone and Address */}
      <div style={{ color: "#6F6F6F", 
        textAlign: "center", 
        marginTop: "10px" 
        }}>
        <p>Phone: {phone}</p>
        <p>Address: {address}</p>
      </div>

      <div style={{ color: "#6F6F6F", borderTop: "1px solid #D6D6D6", paddingLeft: "10px" }}>
        <Link 
          to="/connect" 
          style={{
            textDecoration: "none", 
            color: "black", 
            fontSize: "18px", // Increased font size
            fontWeight: "bold"
          }}
          state={{
            username,
            designation,
            profile_img: profileImage
          }}
        >
          <h5 style={{ fontWeight: "100" }}>Connections</h5>
        </Link>

        {/* Invitations with new invitations indicator */}
        <Link 
          to="/invite" 
          style={{
            textDecoration: "none", 
            color: "grey", 
            fontSize: "18px", // Increased font size
            fontWeight: "bold"
          }}
          state={{
            username,
            designation,
            profile_img: profileImage
          }}
        >
          <h5 style={{ fontWeight: "100" }}>
            Invitations
            {newInvitationsCount > 0 && (
              <span style={{
                marginLeft: "10px",
                backgroundColor: "red",
                color: "white",
                borderRadius: "50%",
                padding: "0 5px",
                fontSize: "12px"
              }}>
                {newInvitationsCount}
              </span>
            )}
          </h5>
        </Link>
      </div>
    </div>
  )
}

export default Sidebar;