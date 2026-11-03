// Events are loaded from the Express API instead of the old local JavaScript array.
import { useEffect, useState } from "react";
import EventList from "../components/EventList.jsx";
import { apiRequest } from "../services/api.js";

export default function Events() {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    apiRequest("/events")
      .then((data) => {
        if (active) setEvents(data.events.map((event) => ({ ...event, id: event._id })));
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
  }, []);

  const filtered = events.filter((event) => {
    const matchName = event.name.toLowerCase().includes(search.toLowerCase());
    const matchCategory = category === "all" || event.category === category;
    return matchName && matchCategory;
  });

  return (
    <section>
      <h2>Events</h2>
      <div className="filters">
        <input
          type="text"
          placeholder="Search event..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <select value={category} onChange={(event) => setCategory(event.target.value)}>
          <option value="all">All categories</option>
          <option value="technical">Technical</option>
          <option value="cultural">Cultural</option>
        </select>
      </div>

      {loading && <p>Loading events from the backend...</p>}
      {error && <p className="error" role="alert">{error}. Make sure the backend and MongoDB are running.</p>}
      {!loading && !error && <EventList list={filtered} />}
    </section>
  );
}
