"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import { Text, usePreferences } from "./preferences";

export function Icon({ name }: { name: string }) {
  return <i aria-hidden="true" className={name} />;
}

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { dark, language, toggleTheme, toggleLanguage } = usePreferences();
  const links = pathname === "/"
    ? [["/about-me", "nav_about_me"], ["/experience", "nav_experience"], ["/projects", "nav_projects"], ["/#skills", "nav_skills"], ["/project-manager", "nav_pm"], ["/contact-me", "nav_contact"]]
    : [["/", "nav_home"], ["/about-me", "nav_about_me"], ["/experience", "nav_experience"], ["/projects", "nav_projects"], ["/project-manager", "nav_pm"], ["/contact-me", "nav_contact"]];

  return <header className="header center">
    <h3><Link href="/" className="link" aria-label="Mutian He home">MH.</Link></h3>
    <nav className="nav center" aria-label={language === "zh" ? "主导航" : "Main navigation"}>
      <ul id="main-navigation" className={`nav__list center${open ? " display-nav-list" : ""}`}>
        {links.map(([href, id]) => {
          const active = href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
          return <li className="nav__list-item" key={href}>
            <Link href={href} className={`link link--nav${active ? " is-active" : ""}`} aria-current={active ? "page" : undefined} onClick={() => setOpen(false)}><Text id={id} /></Link>
          </li>;
        })}
      </ul>
      <button type="button" aria-label="toggle theme" className="btn btn--icon" onClick={toggleTheme}><Icon name={dark ? "fas fa-sun" : "fas fa-moon"} /></button>
      <button id="lang-toggle" type="button" className="btn btn--icon lang-btn" onClick={toggleLanguage}>{language === "en" ? "中文" : "EN"}</button>
      <button type="button" aria-label="toggle navigation" aria-expanded={open} aria-controls="main-navigation" className="btn btn--icon nav__hamburger" onClick={() => setOpen(!open)}><Icon name={open ? "fas fa-times" : "fas fa-bars"} /></button>
    </nav>
  </header>;
}

export function Footer() {
  return <footer className="footer"><a href="https://github.com/austin10231" className="link footer__link"><Text id="footer_text" /></a></footer>;
}

export function SiteShell({ children }: { children: ReactNode }) {
  return <><Header /><main>{children}</main><Footer />
    <div className="scroll-container"><div className="scroll-top"><a aria-label="Scroll up" href="#top"><Icon name="fas fa-arrow-up" /></a></div></div>
  </>;
}
