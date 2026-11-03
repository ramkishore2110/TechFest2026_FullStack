import { Link } from "react-router-dom";
import ApiNotices from "../components/ApiNotices.jsx";

export default function Home() {
  return (
    <div>
      <section className="banner">
        <h2>Welcome to TechFest 26</h2>
        <p>Three days of technical and cultural events on campus.</p>
        <Link to="/events" className="link-btn">See all events</Link>
      </section>

      <section>
        <h2>Highlights</h2>
        <ul>
          <li>30+ technical and cultural events</li>
          <li>Workshops by industry experts</li>
          <li>Prize money worth Rs. 2,00,000</li>
        </ul>
      </section>

      <ApiNotices />
    </div>
  );
}
