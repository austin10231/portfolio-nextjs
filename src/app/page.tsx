import Link from "next/link";
import { Text } from "@/components/preferences";
import { SiteShell } from "@/components/site-shell";
import { ProfileOverview, SkillsSection } from "@/components/profile-overview";

export default function Home() {
  return <SiteShell>
    <ProfileOverview />
    <section className="section gateway" id="highlights">
      <h2 className="section__title"><Text id="home_hub_title" /></h2>
      <p className="gateway__intro"><Text id="home_hub_intro" /></p>
      <div className="gateway__grid">
        <article className="gateway-card">
          <p className="gateway-card__eyebrow"><Text id="home_exp_eyebrow" /></p>
          <h3 className="gateway-card__title"><Text id="home_exp_title" /></h3>
          <p className="gateway-card__desc"><Text id="home_exp_desc" /></p>
          <div className="gateway-card__tracks">
            <Link className="gateway-card__track-link" href="/experience#industry"><Text id="home_exp_track_industry" /></Link>
            <Link className="gateway-card__track-link" href="/experience#research"><Text id="home_exp_track_research" /></Link>
          </div>
          <div className="gateway-card__footer gateway-card__footer--single"><Link className="btn btn--outline gateway-card__btn gateway-card__btn--compact" href="/experience#industry"><Text id="home_exp_btn" /></Link></div>
        </article>
        <article className="gateway-card">
          <p className="gateway-card__eyebrow"><Text id="home_proj_eyebrow" /></p>
          <h3 className="gateway-card__title"><Text id="home_proj_title" /></h3>
          <p className="gateway-card__desc"><Text id="home_proj_desc" /></p>
          <div className="gateway-card__chips">{[1, 2, 3].map(n => <span className="gateway-card__chip" key={n}><Text id={`home_proj_chip_${n}`} /></span>)}</div>
          <div className="gateway-card__footer gateway-card__footer--single"><Link className="btn btn--outline gateway-card__btn gateway-card__btn--compact" href="/projects"><Text id="home_proj_btn" /></Link></div>
        </article>
      </div>
    </section>
    <SkillsSection />
    <section className="section contact center" id="contact"><h2 className="section__title"><Text id="contact_title" /></h2><Link href="/contact-me-server-form"><span className="btn btn--outline"><Text id="btn_email" /></span></Link></section>
  </SiteShell>;
}
