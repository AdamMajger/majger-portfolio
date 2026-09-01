// MAJGER — main app. Fetches projects.json, routes between Work / About / Project Detail.

const { useState, useEffect } = React;

// ---- URL routing -----------------------------------------------------------
// Routes map to real paths so each view is linkable and the browser back
// button works: /work, /about, /work/<slug>. Requires the server to rewrite
// unknown paths to index.html (see .htaccess) — otherwise a refresh 404s.

function routeToPath(route) {
  if (route.view === "profile") return "/about";
  if (route.view === "project") return "/work/" + encodeURIComponent(route.project);
  return "/work";
}

function pathToRoute(pathname) {
  const parts = pathname.replace(/^\/+|\/+$/g, "").split("/");

  if (parts[0] === "about")  return { view: "profile" };
  if (parts[0] === "work" && parts[1]) {
    return { view: "project", project: decodeURIComponent(parts[1]) };
  }
  return { view: "work" };
}

function App() {
  const [projects, setProjects] = useState(null);
  const [route, setRoute] = useState(() => pathToRoute(location.pathname));
  const [activeCat, setActiveCat] = useState("all");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    fetch("projects.json?v=" + Date.now())
      .then(r => r.json())
      .then(data => setProjects(data));
  }, []);

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

  // Browser back/forward: adopt whatever route the popped history entry holds.
  useEffect(() => {
    const onPopState = (e) => setRoute(e.state || pathToRoute(location.pathname));
    addEventListener("popstate", onPopState);
    return () => removeEventListener("popstate", onPopState);
  }, []);

  // Give the first render a state object, so returning to it via back works.
  useEffect(() => {
    history.replaceState(route, "", routeToPath(route));
  }, []);

  if (!projects) return <div style={{ height: "100%", background: "var(--bg)" }} />;

  const goTo = (next) => {
    const path = routeToPath(next);
    if (path !== location.pathname) history.pushState(next, "", path);
    setRoute(next);
  };
  const openProject = (slug) => goTo({ view: "project", project: slug });

  const currentProject = route.view === "project"
    ? projects.find((p) => p.slug === route.project)
    : null;

  // An unknown slug (a stale link, or a real folder like /work/design that
  // isn't a project) would otherwise render an empty page — fall back to the grid.
  const showWork = route.view === "work" || (route.view === "project" && !currentProject);

  return (
    <div className="app">
      <Nav route={route} goTo={goTo} scrolled={scrolled} />
      <div className="stage">
        {showWork && (
          <Work
            projects={projects}
            activeCat={activeCat}
            setActiveCat={setActiveCat}
            openProject={openProject}
            showCaptions={true}
            density="comfortable" />
        )}
        {route.view === "project" && currentProject && (
          <ProjectDetail project={currentProject} projects={projects} goTo={goTo} openProject={openProject} />
        )}
        {route.view === "profile" && <Profile />}
        <Footer goTo={goTo} />
      </div>
    </div>
  );
}

function Nav({ route, goTo, scrolled }) {
  const items = [
    { id: "work",    label: "Work" },
    { id: "profile", label: "About" },
  ];

  return (
    <header className={"nav" + (scrolled ? " nav--scrolled" : "")} style={{ padding: "30px 0 18px" }}>
      <div className="nav__inner" style={{ padding: "20px 40px 0px" }}>
        <button className="nav__brand" onClick={() => goTo({ view: "work" })} aria-label="MAJGER home">
          <span className="nav__brand-name">MAJGER</span>
        </button>
<nav className="nav__links">
          {items.map((it) => {
            const isActive = route.view === it.id || (it.id === "work" && route.view === "project");
            return (
              <button
                key={it.id}
                className={"nav__link" + (isActive ? " nav__link--active" : "")}
                onClick={() => goTo({ view: it.id })}>
                <span className="nav__link-dot" aria-hidden="true">●</span>
                <span>{it.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
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
    </footer>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
