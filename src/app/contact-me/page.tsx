import type { Metadata } from "next";
import ContactPage from "../contact/page";

export const metadata: Metadata = { title: "Contact Me" };
export default function ContactMePage() {
  return <ContactPage />;
}
