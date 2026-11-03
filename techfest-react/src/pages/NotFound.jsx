import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <section>
      <h2>404 - Page Not Found</h2>
      <p>The page you typed does not exist.</p>
      <Link to="/" className="link-btn">Go back home</Link>
    </section>
  );
}
