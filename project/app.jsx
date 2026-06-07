// MAJGER — main app. Routes between Work / Project / Profile.

const { useState, useEffect, useRef, useMemo } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "#e8ff3a",
  "background": "#0e0d0c",
  "density": "comfortable",
  "showCaptions": true
} /*EDITMODE-END*/;

function App() {
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);
  // Route: { view: "work" | "profile", project?: slug }
  const [route, setRoute] = useState({ view: "work" });
  const [activeCat, setActiveCat] = useState("all");
  const [scrolled, setScrolled] = useState(false);

  // Apply css vars from tweaks
  useEffect(() => {
    document.documentElement.style.setProperty("--accent", tweaks.accent);
    document.documentElement.style.setProperty("--bg", tweaks.background);
    // contrast text color from bg lightness
    const isVeryDark = tweaks.background === "#0e0d0c" || tweaks.background === "#000000";
    document.documentElement.style.setProperty("--fg", isVeryDark ? "#e8e6e3" : "#e8e6e3");
  }, [tweaks.accent, tweaks.background]);

  useEffect(() => {
    const stage = document.querySelector(".stage");
    if (stage) stage.scrollTop = 0;
    setScrolled(false);
  }, [route]);

  useEffect(() => {
    const stage = document.querySelector(".stage");
    if (!stage) return;
    const onScroll = () => setScrolled(stage.scrollTop > 12);
    stage.addEventListener("scroll", onScroll, { passive: true });
    return () => stage.removeEventListener("scroll", onScroll);
  }, []);

  const goTo = (next) => setRoute(next);
  const openProject = (slug) => setRoute({ view: "project", project: slug });

  const currentProject = route.view === "project" ?
  PROJECTS.find((p) => p.slug === route.project) :
  null;

  return (
    <div className="app" data-density={tweaks.density}>
      <Nav route={route} goTo={goTo} scrolled={scrolled} />
      <div className="stage">
        {route.view === "work" &&
        <Work
          activeCat={activeCat}
          setActiveCat={setActiveCat}
          openProject={openProject}
          accent={tweaks.accent}
          showCaptions={tweaks.showCaptions}
          density={tweaks.density} />

        }
        {route.view === "project" && currentProject &&
        <ProjectDetail project={currentProject} goTo={goTo} openProject={openProject} accent={tweaks.accent} />
        }
        {route.view === "profile" && <Profile accent={tweaks.accent} />}
        <Footer goTo={goTo} />
      </div>
      <Tweaks tweaks={tweaks} setTweak={setTweak} />
    </div>);

}

function Nav({ route, goTo, scrolled }) {
  const items = [
  { id: "work", label: "Work" },
  { id: "profile", label: "About" }];
  // Contact hidden from nav (kept in app routing): { id: "contact", label: "Contact" }

  return (
    <header className={"nav" + (scrolled ? " nav--scrolled" : "")} style={{ padding: "30px 0 18px" }}>
      <div className="nav__inner" style={{ padding: "20px 40px 0px" }}>
        <button className="nav__brand" onClick={() => goTo({ view: "work" })} aria-label="MAJGER home">
          <span className="nav__brand-name" style={{ padding: "0px" }}>MAJGER</span>
        </button>
        <nav className="nav__links">
          {items.map((it) => {
            const isActive = route.view === it.id || it.id === "work" && route.view === "project";
            return (
              <button
                key={it.id}
                className={"nav__link" + (isActive ? " nav__link--active" : "")}
                onClick={() => goTo({ view: it.id })}>
                
                <span className="nav__link-dot" aria-hidden="true">●</span>
                <span>{it.label}</span>
              </button>);

          })}
        </nav>
      </div>
    </header>);

}

function Footer({ goTo }) {
  return (
    <footer className="footer">
      <div className="footer__row">
        <div className="footer__col">
          <div className="footer__label">Studio</div>
          <a href="mailto:adam.majger@gmail.com" className="footer__link">adam.majger@gmail.com</a>
        </div>
        <div className="footer__col">
          <div className="footer__label">Elsewhere</div>
          <a href="https://www.instagram.com/dratuar/" target="_blank" rel="noopener noreferrer" className="footer__link">Instagram ↗</a>
          <a href="https://www.youtube.com/@TheGlassesChristmas" target="_blank" rel="noopener noreferrer" className="footer__link">YouTube ↗</a>
          <a href="https://soundcloud.com/odorhead" target="_blank" rel="noopener noreferrer" className="footer__link">SoundCloud ↗</a>
        </div>
        <div className="footer__col">
          <div className="footer__label">Index</div>
          <button className="footer__link" onClick={() => goTo({ view: "work" })}>Work</button>
          <button className="footer__link" onClick={() => goTo({ view: "profile" })}>About</button>
        </div>
        <div className="footer__col footer__col--right">
          <div className="footer__label">© 2026</div>
          <div>Majger / based in Bratislava, SK.</div>
          <div className="footer__muted">AVAILABLE FROM 1991</div>
        </div>
      </div>
      <div className="footer__bottom">
        <span className="footer__bottom-mark">MAJGER</span>
        <span className="footer__bottom-tag">Index of work, 2018 — 2026</span>
      </div>
    </footer>);

}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);