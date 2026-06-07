import { useEffect, useState } from "react";
import NewNote from "./NewNote";
import NoteList from "./NoteList";

function Note() {
  const [notes, setNotes] = useState([]);

  const token = localStorage.getItem("access_token");

  useEffect(() => {
    if (!token) {
      console.error("No token found. User might not be logged in.");
      return;
    }

    fetch("http://127.0.0.1:5000/notes", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch notes");
        }

        return res.json();
      })
      .then((data) => {
        setNotes(Array.isArray(data) ? data : []);
      })
      .catch((err) => console.error("Error fetching notes:", err));
  }, [token]);

  return (
    <>
      <h1>Notes</h1>

      <NewNote
        notes={notes}
        setNotes={setNotes}
      />

      <NoteList
        notes={notes}
        setNotes={setNotes}
      />
    </>
  );
}

export default Note;