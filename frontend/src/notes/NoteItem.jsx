import { useState } from "react";

function NoteItem({
  id,
  title,
  content,
  created_at,
  updated_at,
  notes,
  setNotes,
}) {
  const [update, setUpdate] = useState({
    title,
    content,
  });

  const [editing, setEditing] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;

    setUpdate((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleUpdate(e) {
    e.preventDefault();

    const token = localStorage.getItem("access_token");

    fetch(`http://127.0.0.1:5000/notes/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: update.title,
        content: update.content,
      }),
    })
      .then((res) => res.json())
      .then((updatedNote) => {
        const updatedNotes = notes.map((note) =>
          note.id === id ? updatedNote : note
        );

        setNotes(updatedNotes);
        setEditing(false);

        alert("Note updated successfully!");
      })
      .catch((err) => console.error(err));
  }

  function handleDelete() {
    const token = localStorage.getItem("access_token");

    fetch(`http://127.0.0.1:5000/notes/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then(() => {
        const remainingNotes = notes.filter(
          (note) => note.id !== id
        );

        setNotes(remainingNotes);

        alert("Note deleted successfully!");
      })
      .catch((err) => console.error(err));
  }

  return (
    <div className="note-card">
      <h2>{title}</h2>

      <p>{content}</p>

      <p>Created: {created_at}</p>

      <p>Updated: {updated_at}</p>

      <button onClick={() => setEditing(!editing)}>
        {editing ? "Cancel" : "Edit"}
      </button>

      <button onClick={handleDelete}>
        Delete
      </button>

      {editing && (
        <form onSubmit={handleUpdate}>
          <input
            type="text"
            name="title"
            value={update.title}
            onChange={handleChange}
            required
          />

          <textarea
            name="content"
            value={update.content}
            onChange={handleChange}
            required
          />

          <button type="submit">
            Update Note
          </button>
        </form>
      )}
    </div>
  );
}

export default NoteItem;