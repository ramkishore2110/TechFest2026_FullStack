// Event registration is saved in MongoDB through the authenticated backend API.
import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/useAuth.js";
import { apiRequest } from "../services/api.js";

export default function Register() {
  const { user, loading: authLoading } = useAuth();
  const [events, setEvents] = useState([]);
  const [phone, setPhone] = useState("");
  const [eventId, setEventId] = useState("");
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    let active = true;
    apiRequest("/events")
      .then((data) => {
        if (!active) return;
        setEvents(data.events);
        const requestedEvent = searchParams.get("event");
        if (requestedEvent && data.events.some((event) => event._id === requestedEvent)) {
          setEventId(requestedEvent);
        }
      })
      .catch((requestError) => {
        if (active) setError(requestError.message);
      })
      .finally(() => {
        if (active) setLoadingEvents(false);
      });
    return () => { active = false; };
  }, [searchParams]);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    if (!eventId) {
      setError("Please choose an event.");
      return;
    }

    setSubmitting(true);
    try {
      const data = await apiRequest("/registrations", {
        method: "POST",
        body: { eventId, phone }
      });
      const selectedEvent = events.find((item) => item._id === eventId);
      navigate("/confirmation", {
        state: {
          fullname: user.name,
          email: user.email,
          phone,
          event: selectedEvent?.name || data.registration.event?.name || "TechFest event",
          registrationId: data.registration._id
        }
      });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (authLoading) return <section><h2>Registration</h2><p>Checking your account...</p></section>;

  if (!user) {
    return (
      <section>
        <h2>Login Required</h2>
        <p>Please log in or create a participant account before registering for an event.</p>
        <Link
          to="/login"
          state={{ from: `/register${searchParams.toString() ? `?${searchParams.toString()}` : ""}` }}
          className="link-btn"
        >
          Login / Create Account
        </Link>
      </section>
    );
  }

  return (
    <section>
      <h2>Event Registration</h2>
      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>

      <form className="register-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="phone">Mobile Number *</label>
          <input
            id="phone"
            type="tel"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            placeholder="10-digit mobile number"
            pattern="[6-9][0-9]{9}"
            maxLength="10"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="event">Event *</label>
          <select id="event" value={eventId} onChange={(event) => setEventId(event.target.value)} required>
            <option value="">-- Choose an event --</option>
            {events.map((event) => (
              <option key={event._id} value={event._id} disabled={event.seats === 0}>
                {event.name}{event.seats === 0 ? " (Sold Out)" : ` - ${event.seats} seats left`}
              </option>
            ))}
          </select>
        </div>

        {loadingEvents && <p>Loading events...</p>}
        {error && <p className="error" role="alert">{error}</p>}
        <button type="submit" disabled={submitting || loadingEvents}>
          {submitting ? "Submitting..." : "Complete Registration"}
        </button>
      </form>
    </section>
  );
}
