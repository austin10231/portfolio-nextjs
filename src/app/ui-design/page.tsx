import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Smart Parking App – UI Design" };
const screens = [ ["Login", "Login Screen"], ["Map", "Parking Map"], ["Checkout", "Checkout"], ["Reservation", "Reservation"], ["Scan", "QR Scan"], ["Status", "Status Page"] ];
export default function GalleryPage() {
  return <div className="ui-gallery-page"><Link href="/" className="back-link">← Back to Home</Link>
    <h1>Smart Parking App – UI Design</h1>
    <div className="ui-grid">{screens.map(([name, label]) => <div className="ui-card" key={name}><img src={`/UI-design/UI-${name}.png`} alt={`${name} UI`} loading="lazy" /><p>{label}</p></div>)}</div>
  </div>;
}
