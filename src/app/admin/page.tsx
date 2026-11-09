import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { ADMIN_SESSION_COOKIE, adminSecrets, verifySessionToken } from "@/lib/admin-auth";
import { listContactSubmissions } from "@/lib/contact-admin";
import { AdminLogin } from "@/components/admin-login";
import { Text } from "@/components/preferences";
import { logout } from "./actions";

export const metadata: Metadata = { title: "Admin", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

const dateFormat = new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short", timeZone: "America/Los_Angeles" });

export default async function AdminPage() {
  const secrets = adminSecrets();
  const session = await cookies();
  const authorized = secrets ? verifySessionToken(session.get(ADMIN_SESSION_COOKIE)?.value, secrets) : false;

  if (!secrets || !authorized) return <div className="contact-page">
    <header className="header center"><Link href="/" className="link back-link"><Text id="back_home" /></Link></header>
    <main><section className="section contact center" id="admin"><div className="contact-wrapper admin-wrapper">
      <h2 className="section__title"><Text id="admin_title" /></h2>
      <p className="contact__intro">{secrets ? <Text id="admin_login_intro" /> : <Text id="admin_unavailable" />}</p>
      {secrets && <AdminLogin />}
    </div></section></main>
  </div>;

  let listing: Awaited<ReturnType<typeof listContactSubmissions>>;
  try {
    listing = await listContactSubmissions();
  } catch {
    return <div className="contact-page">
      <header className="header center"><Link href="/" className="link back-link"><Text id="back_home" /></Link></header>
      <main><section className="section contact center" id="admin"><div className="contact-wrapper admin-wrapper">
        <h2 className="section__title"><Text id="admin_title" /></h2>
        <p className="field-error" role="alert"><Text id="admin_load_error" /></p>
        <div className="admin-toolbar">
          <form action={logout}><button type="submit" className="btn btn--plain"><Text id="admin_logout" /></button></form>
        </div>
      </div></section></main>
    </div>;
  }
  const { submissions, unreadable } = listing;
  return <div className="contact-page">
    <header className="header center"><Link href="/" className="link back-link"><Text id="back_home" /></Link></header>
    <main><section className="section contact center" id="admin"><div className="contact-wrapper admin-wrapper">
      <h2 className="section__title"><Text id="admin_title" /></h2>
      <p className="contact__intro"><Text id="admin_page_intro" /></p>
      <div className="admin-toolbar">
        <p className="admin-count"><Text id="admin_count_prefix" />{submissions.length}</p>
        <form action={logout}><button type="submit" className="btn btn--plain"><Text id="admin_logout" /></button></form>
      </div>
      {submissions.length === 0
        ? <p className="admin-empty"><Text id="admin_empty" /></p>
        : <div className="admin-table-wrap"><table className="admin-table">
          <thead><tr>
            <th scope="col"><Text id="admin_th_name" /></th>
            <th scope="col"><Text id="admin_th_email" /></th>
            <th scope="col"><Text id="admin_th_message" /></th>
            <th scope="col"><Text id="admin_th_date" /></th>
          </tr></thead>
          <tbody>{submissions.map(submission => <tr key={submission.id}>
            <td data-label="name">{submission.name}</td>
            <td data-label="email"><a href={`mailto:${submission.email}`}>{submission.email}</a></td>
            <td className="cell-message" data-label="message">{submission.message}</td>
            <td className="cell-date" data-label="date">{dateFormat.format(new Date(submission.createdAt))}</td>
          </tr>)}</tbody>
        </table></div>}
      {unreadable > 0 && <p className="field-error"><Text id="admin_unreadable_prefix" />{unreadable}</p>}
    </div></section></main>
  </div>;
}
