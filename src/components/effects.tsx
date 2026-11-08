"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/** The original motion design, with every listener/observer owned by a route effect. */
export function Effects() {
  const pathname = usePathname();
  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = matchMedia("(pointer: coarse)").matches;
    const frames = new Set<number>();
    const timers = new Set<ReturnType<typeof setTimeout>>();
    const frame = (callback: () => void) => {
      const id = requestAnimationFrame(() => { frames.delete(id); callback(); });
      frames.add(id);
      return id;
    };
    const later = (callback: () => void, delay: number) => {
      const id = setTimeout(() => { timers.delete(id); callback(); }, delay);
      timers.add(id);
    };
    const body = document.body;
    if (!reduced) {
      body.classList.add("page-enter");
      frame(() => body.classList.add("page-enter-active"));
      later(() => body.classList.remove("page-enter", "page-enter-active"), 420);
    }

    const selectors = [".about__seeking-badge", ".about__edu-card", ".about__intro", ".about__highlight", ".gateway-card", ".skills__list-item", ".contact .btn", ".hero-band", ".feature-strip", ".project", ".experience-card", ".contact-wrapper"];
    const targets = Array.from(new Set(selectors.flatMap(selector => Array.from(document.querySelectorAll<HTMLElement>(selector)))));
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.16, rootMargin: "0px 0px -8% 0px" });
    targets.forEach((element, index) => {
      element.classList.add("reveal");
      element.style.setProperty("--reveal-delay", `${(index % 8) * 70}ms`);
      if (reduced || coarse) element.classList.add("is-visible");
      else observer.observe(element);
    });

    const scrollUp = () => {
      const element = document.querySelector<HTMLElement>(".scroll-top");
      if (element) element.style.display = window.scrollY > 500 ? "block" : "none";
    };
    document.addEventListener("scroll", scrollUp, { passive: true, signal });
    scrollUp();

    const layer = document.createElement("div");
    layer.className = "cursor-trail-layer";
    layer.setAttribute("aria-hidden", "true");
    if (!reduced && !coarse) {
      body.appendChild(layer);
      let lastX = innerWidth * 0.5, lastY = innerHeight * 0.32, lastEmitAt = 0;
      const spark = (x: number, y: number, burst = false) => {
        const element = document.createElement("span");
        element.className = "cursor-spark";
        const angle = Math.random() * Math.PI * 2;
        const distance = burst ? 16 + Math.random() * 46 : 8 + Math.random() * 22;
        const size = burst ? 4.5 + Math.random() * 5.5 : 3 + Math.random() * 4.2;
        const lifetime = burst ? 640 + Math.random() * 360 : 470 + Math.random() * 250;
        const values = { "--spark-size": `${size.toFixed(2)}px`, "--spark-life": `${Math.round(lifetime)}ms`, "--spark-h": (196 + Math.random() * 34).toFixed(2), "--x": `${x.toFixed(2)}px`, "--y": `${y.toFixed(2)}px`, "--dx": `${(Math.cos(angle) * distance).toFixed(2)}px`, "--dy": `${(Math.sin(angle) * distance).toFixed(2)}px` };
        Object.entries(values).forEach(([key, value]) => element.style.setProperty(key, value));
        layer.appendChild(element);
        element.addEventListener("animationend", () => element.remove(), { once: true });
        if (layer.childElementCount > 110) layer.firstElementChild?.remove();
      };
      window.addEventListener("pointermove", event => {
        const now = performance.now();
        const deltaX = event.clientX - lastX, deltaY = event.clientY - lastY;
        const distance = Math.hypot(deltaX, deltaY);
        if (distance < 6 && now - lastEmitAt < 18) return;
        const steps = Math.max(1, Math.min(5, Math.floor(distance / 18)));
        for (let i = 1; i <= steps; i++) spark(lastX + deltaX * i / steps + (Math.random() - 0.5) * 2.2, lastY + deltaY * i / steps + (Math.random() - 0.5) * 2.2);
        lastX = event.clientX; lastY = event.clientY; lastEmitAt = now;
      }, { passive: true, signal });
      window.addEventListener("pointerdown", event => { for (let i = 0; i < 14; i++) spark(event.clientX, event.clientY, true); }, { passive: true, signal });
      window.addEventListener("pointerleave", () => { lastX = innerWidth * 0.5; lastY = innerHeight * 0.32; }, { signal });
      window.addEventListener("blur", () => layer.replaceChildren(), { signal });
      document.addEventListener("visibilitychange", () => { if (document.hidden) layer.replaceChildren(); }, { signal });

      document.querySelectorAll<HTMLElement>(".gateway-card, .project, .experience-card, .about__edu-card, .hero-band").forEach(card => {
        card.classList.add("interactive-tilt");
        let pending = false, rx = 0, ry = 0, shineX = 50, shineY = 50;
        const update = () => {
          if (pending) return;
          pending = true;
          frame(() => {
            card.style.setProperty("--rx", `${rx.toFixed(2)}deg`);
            card.style.setProperty("--ry", `${ry.toFixed(2)}deg`);
            card.style.setProperty("--shine-x", `${shineX.toFixed(2)}%`);
            card.style.setProperty("--shine-y", `${shineY.toFixed(2)}%`);
            pending = false;
          });
        };
        card.addEventListener("pointerenter", () => card.classList.add("is-hover"), { signal });
        card.addEventListener("pointermove", event => {
          const rect = card.getBoundingClientRect();
          const x = (event.clientX - rect.left) / rect.width, y = (event.clientY - rect.top) / rect.height;
          rx = (0.5 - y) * 10; ry = (x - 0.5) * 10; shineX = x * 100; shineY = y * 100;
          update();
        }, { signal });
        card.addEventListener("pointerleave", () => { card.classList.remove("is-hover"); rx = ry = 0; shineX = shineY = 50; update(); }, { signal });
      });
      document.querySelectorAll<HTMLElement>(".btn--outline, .btn--plain, .gateway-card__btn, .feature-strip").forEach(target => {
        target.classList.add("magnetic");
        target.addEventListener("pointermove", event => {
          const rect = target.getBoundingClientRect();
          const strength = target.classList.contains("feature-strip") ? 9 : 11;
          const x = (event.clientX - rect.left) / rect.width - 0.5, y = (event.clientY - rect.top) / rect.height - 0.5;
          target.style.transform = `translate(${(x * strength).toFixed(2)}px, ${(y * strength).toFixed(2)}px)`;
        }, { signal });
        target.addEventListener("pointerleave", () => { target.style.transform = ""; }, { signal });
      });
    }

    return () => {
      controller.abort(); observer.disconnect(); layer.remove();
      frames.forEach(cancelAnimationFrame); timers.forEach(clearTimeout);
      body.classList.remove("page-enter", "page-enter-active");
    };
  }, [pathname]);
  return null;
}
