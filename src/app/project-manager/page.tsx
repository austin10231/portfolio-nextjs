"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { Text } from "@/components/preferences";
import { PM_STATUSES, loadProjects, parseStack, pmFormSchema, saveProjects, type PMProject, type PMStatus } from "@/lib/project-manager";

type FormState = { title: string; description: string; stack: string; status: PMStatus };

const emptyForm: FormState = { title: "", description: "", stack: "", status: "Planned" };

const errorText: Record<string, string> = {
  title: "Please enter a title (2–80 characters).",
  description: "Please enter a description (10–2,000 characters).",
  stack: "Add at least one technology, separated by commas.",
  status: "Choose a status.",
};

const statusClass = (status: string) => `pm-status pm-status--${status.toLowerCase().replace(/\s+/g, "-")}`;

export default function ProjectManagerPage() {
  const [projects, setProjects] = useState<PMProject[] | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [notice, setNotice] = useState("");
  const [storageError, setStorageError] = useState(false);

  useEffect(() => {
    const result = loadProjects(window.localStorage);
    setProjects(result.projects);
    setStorageError(result.error === "storage");
    if (result.error === "data") setNotice("Saved projects could not be read, so the starter list was restored.");
  }, []);

  const persist = (next: PMProject[]) => {
    setProjects(next);
    if (!saveProjects(window.localStorage, next)) setStorageError(true);
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!projects) return;
    const parsed = pmFormSchema.safeParse({ title: form.title, description: form.description, stack: parseStack(form.stack), status: form.status });
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const field = String(issue.path[0] ?? "form");
        fieldErrors[field] ??= errorText[field] ?? "Please check this field.";
      }
      setErrors(fieldErrors);
      setNotice("");
      return;
    }
    setErrors({});
    if (editingId) {
      persist(projects.map(project => (project.id === editingId ? { ...project, ...parsed.data } : project)));
      setEditingId(null);
      setNotice("Project updated.");
    } else {
      persist([...projects, { id: crypto.randomUUID(), ...parsed.data }]);
      setNotice("Project added.");
    }
    setForm(emptyForm);
  };

  const startEdit = (project: PMProject) => {
    setEditingId(project.id);
    setForm({ title: project.title, description: project.description, stack: project.stack.join(", "), status: project.status });
    setErrors({});
    setNotice("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
    setErrors({});
  };

  const remove = (project: PMProject) => {
    if (!projects || !window.confirm(`Delete "${project.title}"? This cannot be undone.`)) return;
    persist(projects.filter(item => item.id !== project.id));
    if (editingId === project.id) cancelEdit();
    setNotice("Project deleted.");
  };

  const setField = (field: keyof FormState, value: string) => setForm(form => ({ ...form, [field]: value as FormState[typeof field] }));

  return <div className="contact-page">
    <header className="header center"><Link href="/" className="link back-link"><Text id="back_home" /></Link></header>
    <main><section className="section contact center" id="project-manager"><div className="contact-wrapper admin-wrapper">
      <h2 className="section__title">PROJECT MANAGER</h2>
      <p className="contact__intro">Add, view, edit and delete your own projects. Everything is stored in your browser with LocalStorage, so changes remain after refreshing the page.</p>
      {storageError && <p className="field-error" role="alert">LocalStorage is unavailable in this browser, so changes will not persist.</p>}
      <form className="contact-form" onSubmit={submit} noValidate aria-busy={false}>
        <h3 className="pm-form-title">{editingId ? "Edit project" : "Add a project"}</h3>
        <div className="form-row">
          <label htmlFor="pm-title">Title</label>
          <input id="pm-title" name="title" type="text" maxLength={80} value={form.title} onChange={event => setField("title", event.target.value)} aria-invalid={!!errors.title} aria-describedby={errors.title ? "pm-title-error" : undefined} placeholder="e.g. Real-time stock data pipeline" />
          {errors.title && <p className="field-error" id="pm-title-error">{errors.title}</p>}
        </div>
        <div className="form-row">
          <label htmlFor="pm-description">Description</label>
          <textarea id="pm-description" name="description" rows={4} maxLength={2000} value={form.description} onChange={event => setField("description", event.target.value)} aria-invalid={!!errors.description} aria-describedby={errors.description ? "pm-description-error" : undefined} placeholder="What does the project do?" />
          {errors.description && <p className="field-error" id="pm-description-error">{errors.description}</p>}
        </div>
        <div className="form-row">
          <label htmlFor="pm-stack">Technology stack</label>
          <input id="pm-stack" name="stack" type="text" value={form.stack} onChange={event => setField("stack", event.target.value)} aria-invalid={!!errors.stack} aria-describedby={errors.stack ? "pm-stack-error" : undefined} placeholder="Comma-separated, e.g. Python, AWS, Kafka" />
          {errors.stack && <p className="field-error" id="pm-stack-error">{errors.stack}</p>}
        </div>
        <div className="form-row">
          <label htmlFor="pm-status">Status</label>
          <select id="pm-status" name="status" value={form.status} onChange={event => setField("status", event.target.value)}>
            {PM_STATUSES.map(status => <option key={status} value={status}>{status}</option>)}
          </select>
        </div>
        <div aria-live="polite" aria-atomic="true">{notice && <p className="form-status form-status--success" role="status">{notice}</p>}</div>
        <div className="pm-form-actions">
          <button type="submit" className="btn btn--outline">{editingId ? "Save changes" : "Add project"}</button>
          {editingId && <button type="button" className="btn btn--plain" onClick={cancelEdit}>Cancel</button>}
        </div>
      </form>
      {projects !== null && <>
        <div className="pm-toolbar"><p className="pm-count">{projects.length} project{projects.length === 1 ? "" : "s"}</p></div>
        {projects.length === 0
          ? <p className="admin-empty">No projects yet. Add your first project above.</p>
          : <div className="pm-grid">{projects.map(project => <article className="pm-card" key={project.id}>
            <div className="pm-card__head"><h3>{project.title}</h3><span className={statusClass(project.status)}>{project.status}</span></div>
            <p className="pm-desc">{project.description}</p>
            <div className="pm-stack">{project.stack.map(item => <span className="pm-chip" key={item}>{item}</span>)}</div>
            <div className="pm-card__actions">
              <button type="button" className="btn btn--plain" onClick={() => startEdit(project)}>Edit</button>
              <button type="button" className="btn btn--plain pm-delete" onClick={() => remove(project)}>Delete</button>
            </div>
          </article>)}</div>}
      </>}
    </div></section></main>
  </div>;
}
