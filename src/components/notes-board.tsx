"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { Note } from "@/lib/notes";

type NotesBoardProps = { notes: Note[]; storageError: boolean };

/** Child component: everything it renders arrives through props from the server parent page. */
export function NotesBoard({ notes, storageError }: NotesBoardProps) {
  const router = useRouter();
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setError("");
    setNotice("");
    const target = editingId ? `/api/notes/${editingId}` : "/api/notes";
    try {
      const response = await fetch(target, {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const body = await response.json().catch(() => null);
      if (response.ok) {
        setText("");
        setEditingId(null);
        setNotice(editingId ? "Note updated on the server." : "Note saved on the server.");
        router.refresh();
      } else if (response.status === 400) {
        setError("Please enter a note (1–500 characters).");
      } else {
        setError("The server could not save this note. Please try again.");
      }
    } catch {
      setError("The server could not be reached. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const startEdit = (note: Note) => {
    setEditingId(note.id);
    setText(note.text);
    setError("");
    setNotice("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setText("");
    setError("");
  };

  const remove = async (note: Note) => {
    if (busy || !window.confirm("Delete this note? This cannot be undone.")) return;
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const response = await fetch(`/api/notes/${note.id}`, { method: "DELETE" });
      setNotice(response.ok ? "Note deleted." : "The note was already gone. Refreshing.");
      router.refresh();
    } catch {
      setError("The server could not be reached. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return <div className="notes-board">
    {storageError && <p className="field-error" role="alert">Server storage is unavailable right now, so notes cannot be changed.</p>}
    <form className="contact-form" onSubmit={submit} noValidate aria-busy={busy}>
      <h3 className="pm-form-title">{editingId ? "Edit note" : "Add a note"}</h3>
      <div className="form-row">
        <label htmlFor="note-text">Note</label>
        <textarea id="note-text" name="text" rows={3} maxLength={500} value={text} onChange={event => setText(event.target.value)} disabled={busy} aria-invalid={!!error} aria-describedby={error ? "note-text-error" : undefined} placeholder="What would you like to keep on the server?" />
        {error && <p className="field-error" id="note-text-error">{error}</p>}
      </div>
      <div aria-live="polite" aria-atomic="true">{notice && <p className="form-status form-status--success" role="status">{notice}</p>}</div>
      <div className="pm-form-actions">
        <button type="submit" className="btn btn--outline" disabled={busy}>{editingId ? "Save changes" : "Add note"}</button>
        {editingId && <button type="button" className="btn btn--plain" onClick={cancelEdit}>Cancel</button>}
      </div>
    </form>
    <div className="pm-toolbar"><p className="pm-count">{notes.length} note{notes.length === 1 ? "" : "s"} on the server</p></div>
    {notes.length === 0
      ? <p className="admin-empty">No notes yet. Add the first note above.</p>
      : <div className="notes-list">{notes.map(note => <NoteItem key={note.id} note={note} busy={busy} onEdit={startEdit} onDelete={remove} />)}</div>}
  </div>;
}

type NoteItemProps = { note: Note; busy: boolean; onEdit: (note: Note) => void; onDelete: (note: Note) => void };

/** Grandchild component: receives each note and its callbacks through props. */
function NoteItem({ note, busy, onEdit, onDelete }: NoteItemProps) {
  return <article className="note-card">
    <p className="note-card__text">{note.text}</p>
    <p className="note-card__meta">Saved {note.createdAt.slice(0, 10)}</p>
    <div className="pm-card__actions">
      <button type="button" className="btn btn--plain" disabled={busy} onClick={() => onEdit(note)}>Edit</button>
      <button type="button" className="btn btn--plain pm-delete" disabled={busy} onClick={() => onDelete(note)}>Delete</button>
    </div>
  </article>;
}
