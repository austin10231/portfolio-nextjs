import { Text } from "./preferences";

export function PageHero({ kind }: { kind: "experience" | "projects" }) {
  return <section className="section page-hero"><div className={`hero-band hero-band--${kind}`}>
    <p className="hero-band__kicker"><Text id={`${kind}_page_kicker`} /></p>
    <h1 className="hero-band__title"><Text id={`${kind}_page_title`} /></h1>
    <p className="hero-band__desc"><Text id={`${kind}_page_desc`} /></p>
  </div></section>;
}
