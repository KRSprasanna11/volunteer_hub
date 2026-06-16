import React from "react";
import "./LandingPage.css";

export default function LandingPage() {
  return (
    <div className="vh-root">
      {/* Navbar */}
      <header className="vh-nav">
        <div className="vh-container vh-nav-inner">
          <div className="vh-logo">VolunteerHub</div>
          <nav className="vh-nav-links">
            <a href="#about">About</a>
            <a href="#who">Who</a>
            <a href="#features">Features</a>
            <a href="#impact">Impact</a>
            <a href="#contact">Contact</a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="vh-hero">
        <div className="vh-container vh-hero-grid">
          <div className="vh-hero-left">
            <h1>Connecting Volunteers with Meaningful Causes</h1>
            <p className="vh-hero-sub">
              Join hands to create real social impact.
            </p>

            <div className="vh-hero-actions">
              {/* 🔥 MERGED LINKS */}
              <a className="vh-btn vh-btn-primary" href="/login">
                Join as Volunteer
              </a>

              <a className="vh-btn vh-btn-outline" href="/register">
                Create an Event
              </a>
            </div>
          </div>

          <div className="vh-hero-right">
            <div className="vh-hero-image">
              <img
                src="https://plus.unsplash.com/premium_photo-1723514471119-9e5848ef6a5a?q=80&w=1085&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Tree planting community volunteers"
              />

              <div className="vh-hero-badges">
                <span className="vh-badge">Tree Plantation</span>
                <span className="vh-badge">Beach Cleanup</span>
                <span className="vh-badge">Blood Donation</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="vh-section">
        <div className="vh-container">
          <h2 className="vh-title">About VolunteerHub</h2>
          <p className="vh-text">
            VolunteerHub is a digital platform that connects volunteers, NGOs,
            and event organizers. It helps manage volunteering activities,
            attendance, communication, and reporting in one place.
          </p>
        </div>
      </section>

      {/* Who can use */}
      <section id="who" className="vh-section vh-section-alt">
        <div className="vh-container">
          <h2 className="vh-title">Who Can Use VolunteerHub?</h2>
          <div className="vh-card-grid">
            <div className="vh-card">
              <div className="vh-card-media">
                <img
                  src="https://images.pexels.com/photos/12193105/pexels-photo-12193105.jpeg"
                  alt="People helping others"
                />
              </div>
              <div className="vh-card-body">
                <h3>Volunteers</h3>
                <ul className="vh-list">
                  <li>Discover volunteering opportunities</li>
                  <li>Join events</li>
                  <li>Track hours</li>
                  <li>Get updates</li>
                </ul>
              </div>
            </div>

            <div className="vh-card">
              <div className="vh-card-media">
                <img
                  src="https://images.unsplash.com/photo-1551836022-4c4c79ecde51?q=80&w=1200&auto=format&fit=crop"
                  alt="NGO team planning"
                />
              </div>
              <div className="vh-card-body">
                <h3>Organizers / NGOs</h3>
                <ul className="vh-list">
                  <li>Create & manage events</li>
                  <li>Approve volunteers</li>
                  <li>Track attendance</li>
                  <li>Download reports</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="vh-section">
        <div className="vh-container">
          <h2 className="vh-title">How It Works</h2>
          <div className="vh-steps">
            <div className="vh-step">
              <div className="vh-step-icon">1️⃣</div>
              <h4>Register</h4>
              <p>Create an account</p>
            </div>
            <div className="vh-step">
              <div className="vh-step-icon">2️⃣</div>
              <h4>Find or Create Events</h4>
              <p>Volunteers join • Organizers post events</p>
            </div>
            <div className="vh-step">
              <div className="vh-step-icon">3️⃣</div>
              <h4>Participate & Track</h4>
              <p>Attendance & hours recorded</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="vh-section vh-section-alt">
        <div className="vh-container">
          <h2 className="vh-title">Features</h2>
          <div className="vh-features-grid">
            {[
              "Event Management",
              "Volunteer Tracking",
              "Attendance System",
              "Dashboard for Organizers",
              "Real-time Messages",
              "Reports & Analytics",
              "Secure Login",
            ].map((feat) => (
              <div key={feat} className="vh-feature">
                <span className="vh-check">✔</span>
                <span>{feat}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact */}
      <section id="impact" className="vh-section">
        <div className="vh-container">
          <h2 className="vh-title">Impact</h2>
          <div className="vh-impact">
            <div className="vh-impact-item">
              <div className="vh-impact-number">500+</div>
              <div className="vh-impact-label">Volunteers</div>
            </div>
            <div className="vh-impact-item">
              <div className="vh-impact-number">120+</div>
              <div className="vh-impact-label">Events</div>
            </div>
            <div className="vh-impact-item">
              <div className="vh-impact-number">10,000+</div>
              <div className="vh-impact-label">Hours Served</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="vh-section vh-cta">
        <div className="vh-container">
          <h2 className="vh-title vh-cta-title">Ready to make a difference?</h2>
          <div className="vh-cta-actions">
            <a className="vh-btn vh-btn-primary" href="/login">
              Join as Volunteer
            </a>
            <a className="vh-btn vh-btn-outline vh-btn-white" href="/register">
              Register as Organizer
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="vh-footer">
        <div className="vh-container vh-footer-grid">
          <div className="vh-footer-brand">VolunteerHub</div>
          <div className="vh-footer-links">
            <a href="#about">About</a>
            <a href="#contact">Contact</a>
            <a href="#privacy">Privacy Policy</a>
            <a href="#terms">Terms</a>
          </div>
          <div className="vh-footer-copy">© 2026 VolunteerHub</div>
        </div>
      </footer>
    </div>
  );
}
