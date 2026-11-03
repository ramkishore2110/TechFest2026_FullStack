import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/useAuth.js";
import { apiRequest } from "../services/api.js";

export default function MyRegistrations() {
  const { user, loading: authLoading } = useAuth();
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (authLoading) return;
    if (!user) return;

    let active = true;

    apiRequest("/registrations/my")
      .then((data) => {
        if (active) setRegistrations(data.registrations);
      })
      .catch((requestError) => {
        if (active) setError(requestError.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [authLoading, user, refreshKey]);

  async function cancelRegistration(id) {
    setError("");
    setMessage("");
    try {
      const data = await apiRequest(`/registrations/${id}`, { method: "DELETE" });
      setMessage(data.message);
      setRefreshKey((key) => key + 1);
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  if (authLoading) return <section><h2>My Registrations</h2><p>Checking your account...</p></section>;

  if (!user) {
    return (
      <section>
        <h2>My Registrations</h2>
        <p>Please log in to view your event registrations.</p>
        <Link to="/login" className="link-btn">Login</Link>
      </section>
    );
  }

  return (
    <section>
      <h2>My Registrations</h2>
      <p>View the events you have registered for.</p>
      {message && <p className="success" role="status">{message}</p>}
      {error && <p className="error" role="alert">{error}</p>}
      {loading && <p>Loading your registrations...</p>}
      {!loading && !error && registrations.length === 0 && <p>You have not registered for any events yet.</p>}
      {!loading && registrations.length > 0 && (
        <div className="cards">
          {registrations.map((registration) => (
            <article className="card" key={registration._id}>
              <h3>{registration.event?.name || "TechFest event"}</h3>
              <p>Category: {registration.event?.category || "—"}</p>
              <p>Fee: Rs. {registration.event?.fee ?? "—"}</p>
              <p>Status: {registration.status}</p>
              <p>Registered: {new Date(registration.registeredAt).toLocaleDateString()}</p>
              {registration.status === "confirmed" && (
                <button type="button" onClick={() => cancelRegistration(registration._id)}>
                  Cancel Registration
                </button>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
