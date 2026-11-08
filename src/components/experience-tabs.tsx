"use client";

import { useEffect, useLayoutEffect, useRef, useState, type MouseEvent, type KeyboardEvent } from "react";
import { Text } from "./preferences";

type Panel = "industry" | "research";
export function ExperienceTabs() {
  const [active, setActive] = useState<Panel>("industry");
  const shell = useRef<HTMLDivElement>(null);
  const previousHeight = useRef(0);
  const select = (panel: Panel, updateHash = true) => {
    previousHeight.current = shell.current?.getBoundingClientRect().height ?? 0;
    setActive(panel);
    if (updateHash) window.history.replaceState(window.history.state, "", `#${panel}`);
  };
  useEffect(() => {
    const sync = () => {
      const hash = location.hash.slice(1);
      if (["research", "research-detail"].includes(hash)) select("research", false);
      else if (["industry", "industry-detail"].includes(hash)) select("industry", false);
    };
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  useLayoutEffect(() => {
    const element = shell.current;
    const panel = element?.querySelector<HTMLElement>(`#${active}-detail`);
    if (!element || !panel || !previousHeight.current || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const end = panel.offsetHeight;
    element.style.height = `${previousHeight.current}px`;
    element.style.overflow = "hidden";
    element.style.transition = "height 460ms cubic-bezier(0.22, 0.95, 0.24, 1)";
    panel.classList.add("entering");
    const frame = requestAnimationFrame(() => { element.style.height = `${end}px`; });
    const reset = () => { element.style.height = ""; element.style.overflow = ""; element.style.transition = ""; panel.classList.remove("entering"); };
    const timer = setTimeout(reset, 500);
    return () => { cancelAnimationFrame(frame); clearTimeout(timer); reset(); };
  }, [active]);

  const keyDown = (event: KeyboardEvent<HTMLElement>, panel: Panel) => {
    if ((event.target as HTMLElement).closest("a")) return;
    if (event.key === "Enter" || event.key === " ") { event.preventDefault(); select(panel); }
    if (["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) {
      event.preventDefault();
      const next = event.key === "Home" ? "industry" : event.key === "End" ? "research" : panel === "industry" ? "research" : "industry";
      select(next);
      document.getElementById(`${next}-tab`)?.focus();
    }
  };
  const click = (event: MouseEvent<HTMLElement>, panel: Panel) => {
    if (!(event.target as HTMLElement).closest("a")) select(panel);
  };

  return <section className="section experience experience-hub">
    <div className="experience-tabs" role="tablist" aria-label="Experience selector">
      {(["industry", "research"] as const).map((panel, index) => <article key={panel} id={`${panel}-tab`} className={`experience-tab-card${active === panel ? " is-active" : ""}`} role="tab" tabIndex={active === panel ? 0 : -1} aria-controls={`${panel}-detail`} aria-selected={active === panel} onClick={event => click(event, panel)} onKeyDown={event => keyDown(event, panel)}>
        <p className="experience-tab-card__kicker"><Text id={`exp_tab_${index + 1}_kicker`} /></p>
        <h2 className="experience-tab-card__title"><Text id={panel === "industry" ? "exp_role" : "exp2_role"} /></h2>
        <p className="experience-tab-card__meta"><Text id={`exp_tab_${index + 1}_meta`} /></p>
        <div className="experience-tab-card__links">{panel === "industry" ? <>
          <a href="https://risklens.pages.dev/" target="_blank" rel="noreferrer" className="link"><Text id="exp_link_demo" /></a>
          <span className="experience-card__divider">|</span>
          <a href="https://github.com/austin10231/10k-risk-evolution.git" target="_blank" rel="noreferrer" className="link"><Text id="exp_link_github" /></a>
        </> : <a href="https://www.scu.edu/" target="_blank" rel="noreferrer" className="link"><Text id="exp_tab_2_link" /></a>}</div>
        <p className="experience-tab-card__hint"><Text id="exp_tab_hint" /></p>
      </article>)}
    </div>
    <div className="experience-detail-shell" ref={shell}>
      {(["industry", "research"] as const).map(panel => {
        const prefix = panel === "industry" ? "exp" : "exp2";
        return <article className={`experience-card experience-detail-panel${active === panel ? " is-active" : ""}`} id={`${panel}-detail`} key={panel} role="tabpanel" aria-labelledby={`${panel}-tab`} hidden={active !== panel}>
          <header className="experience-card__head"><h2 className="experience-card__role"><Text id={`${prefix}_role`} /></h2><p className="experience-card__period"><Text id={`${prefix}_period`} /></p></header>
          <div className="experience-meta-grid">{(panel === "industry" ? ["company", "project"] : ["org", "focus"]).map(field => <div className="experience-meta-item" key={field}>
            <p className="experience-meta-item__label"><Text id={`${prefix}_${field}_label`} /></p>
            <p className="experience-meta-item__value"><Text id={`${prefix}_${field}`} /></p>
          </div>)}</div>
          <p className="experience-card__summary"><Text id={`${prefix}_summary`} /></p>
          <h3 className="experience-card__subhead"><Text id={`${prefix}_resp_title`} /></h3>
          <ul className="experience-points">{[1, 2, 3].map(n => <li key={n}><Text id={`${prefix}_resp_${n}`} /></li>)}</ul>
          <div className="experience-stack"><p className="experience-stack__label"><Text id={`${prefix}_stack_title`} /></p>
            <ul className="experience-stack__chips">{[1, 2, 3, 4, 5].map(n => <li key={n}><Text id={`${prefix}_stack_${n}`} /></li>)}</ul>
          </div>
        </article>;
      })}
    </div>
  </section>;
}
