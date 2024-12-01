import React, { useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { database } from "../firebase/setup";

function RightBar() {
  const [location, setLocation] = useState("");
  const [skill, setSkill] = useState("");
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleJobSearch = async (e) => {
    e.preventDefault();

    if (!location && !skill) {
      setError("Please enter either location or skill.");
      return;
    }

    setError("");
    setJobs([]);
    setLoading(true);

    try {
      const jobCollection = collection(database, "jobs");
      let q;

      if (location && skill) {
        q = query(
          jobCollection,
          where("location", "==", location),
          where("skill", "==", skill)
        );
      } else if (location) {
        q = query(jobCollection, where("location", "==", location));
      } else if (skill) {
        q = query(jobCollection, where("skill", "==", skill));
      }

      const querySnapshot = await getDocs(q);
      const jobResults = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      if (jobResults.length > 0) {
        setJobs(jobResults);
      } else {
        setError("No jobs found for the given criteria.");
      }
    } catch (err) {
      console.error("Error fetching jobs: ", err);
      setError("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      margin: '0.4rem 2rem 2rem 0.5rem',
      padding: '1rem',
      border: '1px solid #ddd',
      borderRadius: '5px',
      boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
      backgroundColor: '#f8f8f8',
      overflowY: 'scroll',
      height: '500px',
      width:'280px'
    }}>
      <h2 style={{
        textAlign: 'center',
        fontSize: '1.8rem',
        fontWeight: 'bold',
        marginBottom: '1rem',
        color: '#333'
      }}>Find Your Next Job</h2>
      <form onSubmit={handleJobSearch} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Enter location"
          style={{
            padding: '0.8rem',
            border: '1px solid #ccc',
            borderRadius: '5px',
            fontSize: '1rem'
          }}
        />
        <input
          type="text"
          value={skill}
          onChange={(e) => setSkill(e.target.value)}
          placeholder="Enter skill"
          style={{
            padding: '0.8rem',
            border: '1px solid #ccc',
            borderRadius: '5px',
            fontSize: '1rem'
          }}
        />
        <button type="submit" style={{
          padding: '0.8rem 1.5rem',
          backgroundColor: '#007bff',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '1rem'
        }}>
          Search
        </button>
      </form>

      {error && <p style={{ color: 'red', fontSize: '1rem' }}>{error}</p>}
      {loading && <p style={{ fontSize: '1rem' }}>Loading...</p>}

      <div style={{ marginTop: '2rem' }}>
        {jobs.map((job) => (
          <div key={job.id} style={{
            marginBottom: '1rem',
            padding: '1rem',
            border: '1px solid #ddd',
            borderRadius: '5px',
            boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)'
          }}>
            <h3 style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>Job Details</h3>
            <p style={{ fontSize: '1rem' }}><strong>Location:</strong> {job.location}</p>
            <p style={{ fontSize: '1rem' }}><strong>Skill:</strong> {job.skill}</p>
            <p style={{ fontSize: '1rem' }}><strong>Description:</strong> {job.description}</p>
            <p style={{ fontSize: '1rem' }}><strong>Contact:</strong> {job.mobile}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RightBar;