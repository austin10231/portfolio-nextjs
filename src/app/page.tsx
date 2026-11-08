import Link from "next/link";
import { ResumeLink, Text } from "@/components/preferences";
import { Icon, SiteShell } from "@/components/site-shell";
import skills from "@/data/skills.json";

export default function Home() {
  return <SiteShell>
    <div className="about center">
      <h1 className="about__title"><Text id="about_title_prefix" /><span className="about__name"><Text id="about_title_name" /></span></h1>
      <div className="profile-photo-container"><img src="/image/me.png" alt="Mutian He profile" className="profile-photo" width="220" height="220" fetchPriority="high" /></div>
      <h2 className="about__role"><Text id="about_role" /></h2>
      <div className="about__desc">
        <p className="about__seeking-badge"><Text id="about_seeking_badge" /></p>
        <div className="about__edu-grid">{[{ id: 1, image: "SCU.jpg", alt: "Santa Clara University logo" }, { id: 2, image: "UofG.webp", alt: "University of Glasgow logo" }].map(school =>
          <article className="about__edu-card" key={school.id}>
            <div className="about__edu-content">
              <h3 className="about__edu-school"><Text id={`about_edu_school_${school.id}`} /></h3>
              <p className="about__edu-degree"><Text id={`about_edu_degree_${school.id}`} /></p>
              <p className="about__edu-date"><Text id={`about_edu_date_${school.id}`} /></p>
            </div>
            <img src={`/image/${school.image}`} alt={school.alt} className="about__edu-logo" loading="lazy" decoding="async" width="74" height="74" />
          </article>
        )}</div>
        <p className="about__intro"><Text id="about_intro" /></p>
        <ul className="about__highlights">{[1, 2, 3, 4, 5, 6].map(n => <li className="about__highlight" key={n}><Text id={`about_focus_${n}`} /></li>)}</ul>
      </div>
      <div className="about__contact center">
        <ResumeLink />
        <a href="https://github.com/austin10231" aria-label="github" className="link link--icon" target="_blank" rel="noreferrer"><Icon name="fab fa-github" /></a>
        <a href="https://www.linkedin.com/in/mutian-he-58157535a/" aria-label="linkedin" className="link link--icon" target="_blank" rel="noreferrer"><Icon name="fab fa-linkedin" /></a>
      </div>
    </div>
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
    <section className="section skills" id="skills"><h2 className="section__title"><Text id="skills_title" /></h2>
      <ul className="skills__list">{skills.map(skill => <li className="skills__list-item btn btn--plain" key={skill}>{skill}</li>)}</ul>
    </section>
    <section className="section contact center" id="contact"><h2 className="section__title"><Text id="contact_title" /></h2><Link href="/contact"><span className="btn btn--outline"><Text id="btn_email" /></span></Link></section>
  </SiteShell>;
}
