import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="home-page">
      {/* HERO */}
      <section className="home-hero">
        <div className="home-hero-content">
          <span className="home-eyebrow">HEALTHCONNECT</span>

          <h1>Healthcare, connected.</h1>

          <p>
            Manage your healthcare journey in one simple place. Book
            appointments, access medical records, and keep track of your
            prescriptions with ease.
          </p>

          <div className="home-actions">
            <Link to="/register" className="home-primary-button">
              Get Started
            </Link>

            <Link to="/login" className="home-secondary-button">
              Login
            </Link>
          </div>
        </div>

        <div className="home-hero-card">
          <div className="home-card-icon">+</div>
          <h2>Your health. One place.</h2>
          <p>
            Stay connected with your healthcare information and services.
          </p>
        </div>
      </section>

      {/* FEATURES */}
      <section className="home-features">
        <div className="home-section-heading">
          <span className="home-eyebrow">WHAT YOU CAN DO</span>
          <h2>Healthcare made simpler</h2>
          <p>
            HealthConnect brings essential healthcare services together in one
            platform.
          </p>
        </div>

        <div className="home-feature-grid">
          <div className="home-feature-card">
            <div className="home-feature-icon">01</div>
            <h3>Book Appointments</h3>
            <p>
              Find available doctors and schedule appointments at a convenient
              time.
            </p>
          </div>

          <div className="home-feature-card">
            <div className="home-feature-icon">02</div>
            <h3>Medical Records</h3>
            <p>
              Keep your important medical information organized and accessible
              when you need it.
            </p>
          </div>

          <div className="home-feature-card">
            <div className="home-feature-icon">03</div>
            <h3>Prescriptions</h3>
            <p>
              View your prescriptions and keep track of the medication
              information provided by your doctor.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="home-cta">
        <div>
          <span className="home-eyebrow">GET STARTED</span>
          <h2>Take control of your healthcare journey.</h2>
          <p>
            Create your HealthConnect account and start managing your
            healthcare information today.
          </p>
        </div>

        <Link to="/register" className="home-primary-button">
          Create Account
        </Link>
      </section>

      {/* FOOTER */}
      <footer className="home-footer">
        <strong>
          Health<span>Connect</span>
        </strong>

        <p>Connecting people with better healthcare.</p>
      </footer>
    </div>
  );
}

export default Home;