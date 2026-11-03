import { useEffect, useState } from "react";

export default function ApiNotices() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    fetch("https://jsonplaceholder.typicode.com/posts?_limit=4")
      .then((response) => {
        if (!response.ok) throw new Error("Server error");
        return response.json();
      })
      .then((data) => {
        if (active) setNotices(data);
      })
      .catch(() => {
        if (active) setError("Could not load announcements. Please try again later.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  if (loading) return <section><h2>Announcements</h2><p>Loading...</p></section>;
  if (error) return <section><h2>Announcements</h2><p className="error">{error}</p></section>;

  return (
    <section>
      <h2>Festival Notices</h2>
      <ul>
        {notices.map((notice) => (
          <li key={notice.id}>{notice.title}</li>
        ))}
      </ul>
    </section>
  );
}
