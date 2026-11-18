"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { Text } from "@/components/preferences";
import { loadTasks, saveTasks, taskFormSchema, type Task } from "@/lib/task-tracker";

export default function TaskTrackerPage() {
  const [tasks, setTasks] = useState<Task[] | null>(null);
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [notice, setNotice] = useState("");
  const [storageError, setStorageError] = useState(false);

  useEffect(() => {
    const result = loadTasks(window.localStorage);
    setTasks(result.tasks);
    setStorageError(result.error === "storage");
    if (result.error === "data") setNotice("Saved tasks could not be read, so the starter list was restored.");
  }, []);

  const persist = (next: Task[]) => {
    setTasks(next);
    if (!saveTasks(window.localStorage, next)) setStorageError(true);
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!tasks) return;
    const parsed = taskFormSchema.safeParse({ title });
    if (!parsed.success) {
      setError("Please enter a task (1–120 characters).");
      setNotice("");
      return;
    }
    setError("");
    if (editingId) {
      persist(tasks.map(task => (task.id === editingId ? { ...task, title: parsed.data.title } : task)));
      setEditingId(null);
      setNotice("Task updated.");
    } else {
      persist([...tasks, { id: crypto.randomUUID(), title: parsed.data.title, done: false }]);
      setNotice("Task added.");
    }
    setTitle("");
  };

  const startEdit = (task: Task) => {
    setEditingId(task.id);
    setTitle(task.title);
    setError("");
    setNotice("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setTitle("");
    setError("");
  };

  const toggle = (task: Task) => {
    if (!tasks) return;
    persist(tasks.map(item => (item.id === task.id ? { ...item, done: !item.done } : item)));
  };

  const remove = (task: Task) => {
    if (!tasks || !window.confirm(`Delete "${task.title}"? This cannot be undone.`)) return;
    persist(tasks.filter(item => item.id !== task.id));
    if (editingId === task.id) cancelEdit();
    setNotice("Task deleted.");
  };

  const remaining = tasks?.filter(task => !task.done).length ?? 0;

  return <div className="contact-page">
    <header className="header center"><Link href="/" className="link back-link"><Text id="back_home" /></Link></header>
    <main><section className="section contact center" id="task-tracker"><div className="contact-wrapper">
      <h2 className="section__title">TASK TRACKER</h2>
      <p className="contact__intro">Add, check off, edit and delete simple tasks. Everything is stored in your browser with LocalStorage, so changes remain after refreshing the page.</p>
      {storageError && <p className="field-error" role="alert">LocalStorage is unavailable in this browser, so changes will not persist.</p>}
      <form className="contact-form" onSubmit={submit} noValidate aria-busy={false}>
        <h3 className="pm-form-title">{editingId ? "Edit task" : "Add a task"}</h3>
        <div className="form-row">
          <label htmlFor="task-title">Task</label>
          <input id="task-title" name="title" type="text" maxLength={120} value={title} onChange={event => setTitle(event.target.value)} aria-invalid={!!error} aria-describedby={error ? "task-title-error" : undefined} placeholder="e.g. Review the lecture notes" />
          {error && <p className="field-error" id="task-title-error">{error}</p>}
        </div>
        <div aria-live="polite" aria-atomic="true">{notice && <p className="form-status form-status--success" role="status">{notice}</p>}</div>
        <div className="pm-form-actions">
          <button type="submit" className="btn btn--outline">{editingId ? "Save changes" : "Add task"}</button>
          {editingId && <button type="button" className="btn btn--plain" onClick={cancelEdit}>Cancel</button>}
        </div>
      </form>
      {tasks !== null && <>
        <div className="pm-toolbar"><p className="pm-count">{remaining} of {tasks.length} task{tasks.length === 1 ? "" : "s"} remaining</p></div>
        {tasks.length === 0
          ? <p className="admin-empty">No tasks yet. Add your first task above.</p>
          : <ul className="tasks-list">{tasks.map(task => <li className={`task-item${task.done ? " task-item--done" : ""}`} key={task.id}>
            <input type="checkbox" className="task-check" aria-label={`Mark "${task.title}" ${task.done ? "not done" : "done"}`} checked={task.done} onChange={() => toggle(task)} />
            <p className="task-item__title">{task.title}</p>
            <span className="task-item__actions">
              <button type="button" className="btn btn--plain" onClick={() => startEdit(task)}>Edit</button>
              <button type="button" className="btn btn--plain pm-delete" onClick={() => remove(task)}>Delete</button>
            </span>
          </li>)}</ul>}
      </>}
    </div></section></main>
  </div>;
}
