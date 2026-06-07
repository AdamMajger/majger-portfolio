// Project Detail view

function ProjectDetail({ project, goTo, openProject, accent }) {
  // Find next project (loop)
  const idx = PROJECTS.findIndex((p) => p.slug === project.slug);
  const next = PROJECTS[(idx + 1) % PROJECTS.length];

  return (
    <main className="detail" data-screen-label={"Project — " + project.title}>
      <div className="detail__crumbs">
        <button onClick={() => goTo({ view: "work" })} className="crumb">← Index</button>
        <span className="crumb__sep">/</span>
        <span className="crumb crumb--current">{project.title}</span>
      </div>

      {/* Full-bleed hero */}
      <section className="detail__hero">
        {project.image ?
          <div className="ph ph--image detail__hero-img" style={{ overflow: "hidden", background: "var(--card-bg)", maxHeight: "78vh", display: "flex" }}>
            <img src={project.image} alt={project.title}
                 style={{ maxHeight: "78vh", width: "auto", maxWidth: "100%", objectFit: "contain", display: "block" }} />
          </div> :
          <Placeholder
            label={project.placeholder + " — hero"}
            ratio="21/9"
            variant={project.variant}
            hue={project.hue}
            tone={project.tone}
            animate={project.animate}
            accent={accent} />
        }
        
      </section>

      {/* Metadata + description: two columns */}
      <section className="detail__head">
        <div className="detail__head-left">
          <div className="detail__mono">[ {project.categoryLabel} · {project.year} ]</div>
          <h1 className="detail__title">{project.title}</h1>
          <dl className="detail__meta">
            <div className="detail__meta-row">
              <dt>Client</dt><dd>{project.client}</dd>
            </div>
            <div className="detail__meta-row">
              <dt>Authors</dt><dd>{project.authors}</dd>
            </div>
            <div className="detail__meta-row">
              <dt>Role</dt><dd>{project.role}</dd>
            </div>
            <div className="detail__meta-row">
              <dt>Period</dt><dd>{project.duration}</dd>
            </div>
            <div className="detail__meta-row">
              <dt>Category</dt><dd>{project.categoryLabel}</dd>
            </div>
          </dl>
        </div>
        <div className="detail__head-right">
          <p className="detail__lede">{project.description}</p>
        </div>
      </section>

      {/* Gallery — alternating widths */}
      <section className="detail__gallery">
        {project.gallery.map((g, i) => {
          // Alternate: index 0 standard, 1 full, 2 standard etc — but be more interesting
          const fullBleed = !g.image && (i % 3 === 1 || g.ratio === "21/9" || g.ratio === "16/9");
          return (
            <div key={i} className={"detail__row " + (fullBleed ? "detail__row--full" : "detail__row--std")}>
              {g.image ?
                <div className="ph ph--image" style={{ overflow: "hidden", background: "var(--card-bg)" }}>
                  <img src={g.image} alt={g.label}
                       style={{ width: "100%", height: "auto", display: "block" }} />
                </div> :
                <Placeholder
                  label={g.label}
                  ratio={g.ratio}
                  variant={g.variant}
                  hue={g.hue}
                  tone={project.tone}
                  accent={accent} />
              }
              
            </div>);

        })}
      </section>

      {/* Embeds: YouTube + SoundCloud */}
      {(project.youtube || project.soundcloud) &&
      <section className="detail__embeds">
          {project.youtube &&
        <div className="embed" style={{ textAlign: "center", alignItems: "stretch" }}>
              <div className="embed__head">
                <span className="embed__mono">[ Case-study video ]</span>
                <span className="embed__source">YouTube</span>
              </div>
              <div className="embed__frame embed__frame--video" style={{ backgroundPosition: "center center" }}>
                <div className="embed__play">
                  <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                    <circle cx="32" cy="32" r="31" stroke="currentColor" strokeWidth="1" />
                    <polygon points="26,22 26,42 44,32" fill="currentColor" />
                  </svg>
                </div>
                <span className="embed__label">{project.youtube}</span>
              </div>
            </div>
        }
          {project.soundcloud &&
        <div className="embed">
              <div className="embed__head">
                <span className="embed__mono">[ Atmosphere ]</span>
                <span className="embed__source">SoundCloud</span>
              </div>
              <div className="embed__frame embed__frame--audio">
                <div className="waveform" aria-hidden="true">
                  {Array.from({ length: 84 }).map((_, i) => {
                const h = 18 + Math.abs(Math.sin(i * 0.7) + Math.cos(i * 0.31)) * 28;
                return <span key={i} className="waveform__bar" style={{ height: h + "%" }} />;
              })}
                </div>
                <div className="embed__audio-meta">
                  <span className="embed__label">▶  {project.soundcloud}</span>
                  <span className="embed__time">00:00 / 38:11</span>
                </div>
              </div>
            </div>
        }
        </section>
      }

      {/* Next project */}
      <section className="detail__next">
        <div className="detail__next-mono">[ Next project ]</div>
        <button className="detail__next-card" onClick={() => openProject(next.slug)}>
          <span className="detail__next-num">{String(PROJECTS.indexOf(next) + 1).padStart(2, "0")}</span>
          <span className="detail__next-title">{next.title}</span>
          <span className="detail__next-cat">{next.categoryLabel} — {next.year}</span>
          <span className="detail__next-arrow">→</span>
        </button>
      </section>
    </main>);

}

Object.assign(window, { ProjectDetail });