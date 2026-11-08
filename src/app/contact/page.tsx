import type { Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "@/components/contact-form";
import { Text } from "@/components/preferences";

export const metadata: Metadata = { title: "Contact Me" };
export default function ContactPage() {
  return <div className="contact-page">
    <header className="header center"><Link href="/" className="link back-link"><Text id="back_home" /></Link></header>
    <main><section className="section contact center" id="contact"><div className="contact-wrapper">
      <h2 className="section__title"><Text id="contact_title_page" /></h2>
      <p className="contact__intro"><Text id="contact_intro" /></p>
      <ContactForm />
      <p className="contact__note"><span><Text id="contact_note_prefix" /></span>{" "}<a href="mailto:austin10231@outlook.com">austin10231@outlook.com</a>.</p>
    </div></section></main>
  </div>;
}
