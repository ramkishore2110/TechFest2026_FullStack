// EventList - receives an array through props and shows one EventCard for each item.
import EventCard from "./EventCard.jsx";

export default function EventList({ list }) {
  if (list.length === 0) {
    return <p>No events match your search.</p>;
  }

  return (
    <div className="cards">
      {list.map((event) => (
        // key must be unique - React uses it to keep track of each card
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
}
