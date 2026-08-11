import "./App.css";

function App() {
return ( <div className="app"> <header className="navbar"> <div className="logo">
Health<span>Connect</span> </div>


    <nav>
      <a href="#home">Home</a>
      <a href="#features">Features</a>
      <a href="#about">About</a>
    </nav>

    <div className="nav-actions">
      <button className="login-btn">Login</button>
      <button className="signup-btn">Get Started</button>
    </div>
  </header>

  <main>
    <section className="hero" id="home">
      <div className="hero-content">
        <p className="eyebrow">YOUR HEALTH, CONNECTED</p>

        <h1>
          Healthcare made
          <span> simpler.</span>
        </h1>

        <p className="hero-text">
          HealthConnect brings patients, doctors, appointments,
          medical records and prescriptions together in one secure
          platform.
        </p>

        <div className="hero-actions">
          <button className="primary-btn">Get Started</button>
          <button className="secondary-btn">Learn More</button>
        </div>
      </div>

      <div className="hero-card">
        <div className="card-header">
          <div>
            <p>Welcome back</p>
            <h3>HealthConnect</h3>
          </div>

          <div className="status-dot"></div>
        </div>

        <div className="health-summary">
          <p>Today's Overview</p>

          <div className="summary-grid">
            <div className="summary-item">
              <strong>04</strong>
              <span>Appointments</span>
            </div>

            <div className="summary-item">
              <strong>03</strong>
              <span>Records</span>
            </div>

            <div className="summary-item">
              <strong>01</strong>
              <span>Prescription</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section className="features" id="features">
      <div className="section-heading">
        <p className="eyebrow">EVERYTHING IN ONE PLACE</p>

        <h2>
          Healthcare that works
          <span> for you.</span>
        </h2>
      </div>

      <div className="feature-grid">
        <article className="feature-card">
          <div className="feature-icon">01</div>
          <h3>Appointments</h3>
          <p>
            Book and manage appointments with healthcare
            professionals easily.
          </p>
        </article>

        <article className="feature-card">
          <div className="feature-icon">02</div>
          <h3>Medical Records</h3>
          <p>
            Keep your medical history and important documents
            organized in one secure place.
          </p>
        </article>

        <article className="feature-card">
          <div className="feature-icon">03</div>
          <h3>Prescriptions</h3>
          <p>
            Access prescriptions and treatment instructions
            whenever you need them.
          </p>
        </article>
      </div>
    </section>
  </main>

  <footer id="about">
    <p>© 2026 HealthConnect. Healthcare, connected.</p>
  </footer>
</div>


);
}

export default App;