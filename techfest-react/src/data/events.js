// A plain array of objects - this replaces the "events" array from app.js (Experiment 2).
// In React we keep data in a separate file so any component can import it.

export const events = [
  { id: 1, name: "Code Sprint",       category: "technical", fee: 100, seats: 3 },
  { id: 2, name: "Web Design League", category: "technical", fee: 80,  seats: 2 },
  { id: 3, name: "Robo Race",         category: "technical", fee: 150, seats: 4 },
  { id: 4, name: "Tech Quiz",         category: "technical", fee: 50,  seats: 5 },
  { id: 5, name: "Battle of Bands",   category: "cultural",  fee: 200, seats: 2 },
  { id: 6, name: "Street Dance Duel", category: "cultural",  fee: 120, seats: 3 }
];
