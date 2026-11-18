import Link from "next/link";
import { Text } from "@/components/preferences";
import { listNotes } from "@/lib/notes-storage";
import { NotesBoard } from "@/components/notes-board";

export const dynamic = "force-dynamic";

export default async function NotesPage() {
  const { notes, error } = await listNotes();
  return <div className="contact-page">
    <header className="header center"><Link href="/" className="link back-link"><Text id="back_home" /></Link></header>
    <main><section className="section contact center" id="notes"><div className="contact-wrapper admin-wrapper">
      <h2 className="section__title">NOTES</h2>
      <p className="contact__intro">Short notes stored on the server as JSON. This page is a parent component that fetches the notes from the server and passes them to a child component through props.</p>
      <NotesBoard notes={notes} storageError={error} />
    </div></section></main>
  </div>;
}
