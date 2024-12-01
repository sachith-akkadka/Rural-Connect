import React from 'react';
import profile from "../images/profile.png";
import { Link } from 'react-router-dom';

function Sidebar({ userData }) {
  // Extract user data
  const username = userData._document?.data?.value.mapValue.fields.username.stringValue ?? '';
  const profileImage = userData._document?.data?.value.mapValue.fields.profile_image.stringValue ?? profile;
  const designation = userData._document?.data?.value.mapValue.fields.designation.stringValue ?? '';
  const phone = userData._document?.data?.value.mapValue.fields.phone?.stringValue ?? '';
  const address = userData._document?.data?.value.mapValue.fields.address?.stringValue ?? '';
  const skills = userData._document?.data?.value.mapValue.fields.skills?.stringValue ?? 'No skills listed';
  const newInvitationsCount = userData._document?.data?.value.mapValue.fields.new_invitations_count?.integerValue ?? 0;

  return (
    <div
      style={{
        backgroundColor: 'white',
        border: '1px solid #D6D6D6',
        width: '230px',
        borderRadius: '10px',
        marginLeft: '55px',
        padding: '15px',
      }}
    >
      {/* Profile Section */}
      <div style={{ textAlign: 'center', marginBottom: '15px' }}>
        <img
          src={profileImage}
          style={{ width: '65px', borderRadius: '40px' }}
          alt="Profile"
        />
        <h3 style={{ margin: '10px 0 5px 0' }}>{username}</h3>
        <h4 style={{ color: '#6F6F6F', margin: 0 }}>{designation}</h4>
      </div>

      {/* Contact Information */}
      <div
        style={{
          backgroundColor: '#F3F3F3',
          padding: '10px',
          borderRadius: '8px',
          marginBottom: '15px',
        }}
      >
        <h4 style={{ textAlign: 'center', marginBottom: '10px' }}>Contact Information</h4>
        <p style={{ margin: '10px 0', textAlign: 'center', fontSize: '14px', color: '#6F6F6F' }}>
          <strong>Phone: </strong>{phone}
        </p>
        <p style={{ margin: '10px 0', textAlign: 'center', fontSize: '14px', color: '#6F6F6F' }}>
          <strong>Address: </strong>{address}
        </p>
      </div>

      {/* Skills Section */}
      <div
        style={{
          backgroundColor: '#F3F3F3',
          padding: '10px',
          borderRadius: '8px',
          marginBottom: '15px',
        }}
      >
        <h4 style={{ textAlign: 'center', marginBottom: '10px' }}>Skills</h4>
        <p style={{ color: '#6F6F6F', fontSize: '14px', textAlign: 'center' }}>
          {skills}
        </p>
      </div>

      {/* Connections Section */}
      <div
  style={{
    backgroundColor: '#F3F3F3',
    padding: '10px',
    borderRadius: '8px',
    marginBottom: '10px',
    textAlign: 'center', // Center the text
  }}
>
  <Link
    to="/network"
    style={{
      textDecoration: 'none',
      color: 'black',
      fontWeight: 'bold',
      fontSize: '18px',
      textAlign: 'center', // Ensure text alignment remains centered
      display: 'inline-block', // Ensures proper centering with the link
    }}
    state={{
      username,
      designation,
      profile_img: profileImage,
    }}
  >
    My Connections
  </Link>
</div>


      {/* Invitations Section */}
      <div
        style={{
          backgroundColor: '#F3F3F3',
          padding: '10px',
          borderRadius: '8px',
          marginBottom: '15px',
          position: 'relative',
        }}
      >
        <Link
          to="/invite"
          style={{
            textDecoration: 'none',
            color: 'black',
            fontWeight: 'bold',
            textAlign: 'center',
            fontSize: '18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          state={{
            username,
            designation,
            profile_img: profileImage,
          }}
        >
          New Invitations
          {newInvitationsCount > 0 && (
            <span
              style={{
                marginLeft: '10px',
                backgroundColor: 'Blue',
                color: 'white',
                borderRadius: '50%',
                padding: '0 5px',
                fontSize: '12px',
              }}
            >
              {newInvitationsCount}
            </span>
          )}
        </Link>
      </div>
    </div>
  );
}

export default Sidebar;
