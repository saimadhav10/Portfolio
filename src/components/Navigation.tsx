"use client";
import { useEffect, useState } from "react";
const links = [
  ["about", "About"],
  ["projects", "Projects"],
  ["skills", "Skills"],
  ["resume", "Résumé"],
  ["contact", "Connect"],
];
export default function Navigation() {
  const [open, setOpen] = useState(false),
    [active, setActive] = useState("home");
  useEffect(() => {
    const update = () => {
      let id = "home";
      for (const [section] of links) {
        const el = document.getElementById(section);
        if (el && el.getBoundingClientRect().top < innerHeight * 0.4)
          id = section;
      }
      setActive(id);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    const escape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", escape);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("keydown", escape);
    };
  }, []);
  return (
    <header className="header">
      <a className="wordmark" href="#home" aria-label="Sai Madhav home">
        sm<span>•</span>
      </a>
      <div className="navigation-shell">
        <button
          className="menu-toggle"
          aria-expanded={open}
          aria-controls="section-nav"
          onClick={() => setOpen(!open)}
        >
          {open ? "Close −" : "Explore +"}
        </button>
        <nav
          id="section-nav"
          aria-label="Main navigation"
          className={open ? "is-open" : ""}
        >
          {links.map(([id, label], i) => (
            <a
              href={`#${id}`}
              key={id}
              aria-current={active === id ? "location" : undefined}
              onClick={() => setOpen(false)}
            >
              <span className="nav-index">0{i + 1}</span>
              {label}
              {id === "contact" && <span aria-hidden="true">↗</span>}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
