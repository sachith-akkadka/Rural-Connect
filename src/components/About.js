import React from 'react';
import './about.css'; // Update with combined styles
import logo from '../images/RC.png'; // Ensure the image path is correct

function About() {
    return (
        <div className="about-container">
            <div className="about-header">
                <img src={logo} alt="Rural Connect Logo" className="about-logo" style={{ width: '200px', height: '200px' }} />
                <h1>About Us</h1>
            </div>

            <p>
                Welcome to <strong>Rural Connect</strong>. Our platform is dedicated to bridging the gap between skilled rural workers and employers by providing a dynamic and user-friendly environment for job searching and hiring.
            </p>

            <h2>Our Offerings</h2>
            <ul>
                <li>
                    <strong>Job Opportunities:</strong> Employers can post job openings, while rural workers can explore and apply for positions that match their skills and expertise.
                </li>
                <li>
                    <strong>Networking:</strong> Our platform fosters collaboration by connecting job seekers, employers, and industry experts in a digital space.
                </li>
                <li>
                    <strong>Profile Customization:</strong> Users can create personalized profiles highlighting their skills, experience, and achievements to attract potential employers.
                </li>
                <li>
                    <strong>Messaging System:</strong> Seamless communication between employers and job seekers ensures faster hiring decisions and better understanding.
                </li>
            </ul>

            <h2>Why Choose Rural Connect?</h2>
            <p>
                Rural Connect is more than just a job portal — it is a comprehensive ecosystem designed to drive rural economic growth and digital inclusion.
            </p>
            <ul>
                <li>We focus on underserved rural areas, promoting employment and entrepreneurship.</li>
                <li>Our platform is intuitive and accessible, ensuring easy navigation for users with limited digital literacy.</li>
            </ul>

            <h2>Use Cases</h2>
            <ul>
                <li>
                    <strong>For Rural Workers:</strong> A skilled artisan from a village can gain visibility on our platform and receive bulk orders from urban clients, transforming their business and livelihood.
                </li>
                <li>
                    <strong>For Employers:</strong> A small-scale farmer can use our platform to hire local laborers during the harvest season quickly and efficiently.
                </li>
            </ul>

            <h2>How It Works</h2>
            <ol>
                <li>
                    <strong>For Job Seekers:</strong> Register, create a profile, and explore job postings tailored to your skills and interests.
                </li>
                <li>
                    <strong>For Employers:</strong> Sign up, post job openings, and find skilled candidates who meet your requirements.
                </li>
            </ol>

            <h2>Join Us</h2>
            <p>
                At Rural Connect, we believe in empowering communities and creating a sustainable future. Whether you are a job seeker, an employer, or an organization looking to uplift rural talent, there is a place for you here.
            </p>
            <p>
                Together, we can make a difference. Join <strong>Rural Connect</strong> today and be a part of the change.
            </p>

            {/* Contact Section */}
            <div className="contact-section">
                <h2>Contact Us</h2>
                <p><i className="fas fa-envelope"></i> <a href="mailto:ruralconnect@gmail.com">ruralconnect@gmail.com</a></p>
                <p><i className="fas fa-phone-square-alt"></i> +91 6363609736</p>
                <p><i className="fas fa-map-marker-alt"></i> Puttur, Mangalore, Karnataka, India</p>

                {/* Social Media Icons */}
                <div className="social-icons">
                    <a href=""><i className="fab fa-linkedin"></i></a>
                    <a href=""><i className="fab fa-instagram"></i></a>
                    <a href=""><i className="fab fa-twitter"></i></a>
                    <a href=""><i className="fab fa-github"></i></a>
                </div>
            </div>
        </div>
    );
}

export default About;