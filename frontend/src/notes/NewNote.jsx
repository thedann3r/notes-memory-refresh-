import { useState } from "react";

function NewNote({ notes, setNotes }) {
  const [newNote, setNewNote] = useState({
    title: "",
    content: "",
  });

  function handleChange(e) {
    const { name, value } = e.target;

    setNewNote((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleSubmit(e) {
  e.preventDefault();

  const token = localStorage.getItem("access_token");

  if (!token) {
    alert("You must be logged in!");
    return;
  }

  fetch("http://127.0.0.1:5000/notes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(newNote),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to create note");
      }

      return response.json();
    })
    .then((createdNote) => {
      setNotes((prevNotes) => [
        ...prevNotes,
        createdNote,
      ]);

      setNewNote({
        title: "",
        content: "",
      });

      alert("Note created successfully!");
    })
    .catch((error) => {
      console.error(error);
      alert("Error creating note");
    });
}

  return (
    <div className="new-note">
      <h2>Create Note</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={newNote.title}
          onChange={handleChange}
          required
        />

        <textarea
          name="content"
          placeholder="Content"
          value={newNote.content}
          onChange={handleChange}
          required
        />

        <button type="submit">
          Add Note
        </button>
      </form>
    </div>
  );
}

export default NewNote;