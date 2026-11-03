import { useLocation, Link } from "react-router-dom";

export default function Confirmation() {
  const location = useLocation();
  const data = location.state;

  if (!data) {
    return (
      <section>
        <h2>No registration found</h2>
        <Link to="/register">Go to registration</Link>
      </section>
    );
  }

  return (
    <section>
      <h2>Registration Successful</h2>
      <p>Name: {data.fullname}</p>
      <p>Email: {data.email}</p>
      <p>Mobile: {data.phone}</p>
      <p>Event: {data.event}</p>
      {data.registrationId && <p>Registration ID: {data.registrationId}</p>}
      <Link to="/events" className="link-btn">Back to events</Link>
    </section>
  );
}
