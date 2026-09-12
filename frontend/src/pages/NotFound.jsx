import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="not-found-page">
      <div className="not-found-card">
        <div className="not-found-icon">404</div>

        <p className="eyebrow">HEALTHCONNECT</p>

        <h1>Page Not Found</h1>

        <p>
          Sorry, the page you're looking for doesn't
          exist or may have been moved.
        </p>

        <div className="not-found-actions">
          <Link to="/" className="not-found-home-button">
            ← Go Home
          </Link>

          <Link
            to="/login"
            className="not-found-login-button"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NotFound;