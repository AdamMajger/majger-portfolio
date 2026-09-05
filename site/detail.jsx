// Project Detail view

function ProjectDetail({ project, projects, goTo, openProject }) {
  const idx = projects.findIndex((p) => p.slug === project.slug);
  const next = projects[(idx + 1) % projects.length];

  return (
    <main className="detail">
      <div className="detail__crumbs">
        <button onClick={() => goTo({ view: "work" })} className="crumb">← Index</button>
        <span className="crumb__sep">/</span>
        <span className="crumb crumb--current">{project.title}</span>
      </div>

      {/* Hero image */}
      <section className="detail__hero">
        {project.image && project.image.endsWith(".mp4") ?
          <div className="ph ph--image detail__hero-img" style={{ overflow: "hidden", background: "var(--bg)", maxHeight: "78vh", display: "flex" }}>
            <video src={project.image} autoPlay muted loop playsInline
                   style={{ maxHeight: "78vh", width: "auto", maxWidth: "100%", objectFit: "contain", display: "block" }} />
          </div>
        : project.image ?
          <div className="ph ph--image detail__hero-img" style={{ overflow: "hidden", background: "var(--bg)", maxHeight: "78vh", display: "flex" }}>
            <img src={project.image} alt={project.title}
                 style={{ maxHeight: "78vh", width: "auto", maxWidth: "100%", objectFit: "contain", display: "block" }} />
          </div>
        : project.youtubeThumbId ?
          /* No still image, but a video — play it as the hero. */
          <div className="detail__hero-video">
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${project.youtubeThumbId}?rel=0&modestbranding=1`}
              title={project.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen />
          </div>
        :
          <Placeholder
            label={project.placeholder + " — hero"}
            ratio="21/9"
            variant={project.variant}
            hue={project.hue}
            tone={project.tone}
            bg="var(--bg)"
            animate={project.animate} />
        }
      </section>

      {/* Metadata + description */}
      <section className="detail__head">
        <div className="detail__head-left">
          <div className="detail__mono">[ {project.categoryLabel} · {project.year} ]</div>
          <h1 className="detail__title">{project.title}</h1>
          {/* Only rows with a value — an empty field leaves no blank line behind. */}
          <dl className="detail__meta">
            {[
              ["Client",   project.client],
              ["Authors",  project.authors],
              ["Role",     project.role],
              ["Period",   project.duration],
              ["Category", project.categoryLabel],
            ].filter(([, value]) => value).map(([label, value]) => (
              <div className="detail__meta-row" key={label}><dt>{label}</dt><dd>{value}</dd></div>
            ))}
          </dl>
        </div>
        <div className="detail__head-right">
          {/* Blank lines in the description become separate paragraphs —
              HTML would otherwise collapse them into one run-on block. */}
          {project.description.split(/\n\s*\n/).filter(Boolean).map((para, i) => (
            <p className="detail__lede" key={i}>{para.trim()}</p>
          ))}
        </div>
      </section>

      {/* Gallery — consecutive portrait images share a row; everything else
          gets a full-width row of its own. */}
      <section className="detail__gallery">
        {groupGallery(project.gallery).map((group, gi) =>
          group.portrait ? (
            <div key={gi} className="detail__row detail__row--grid">
              {group.items.map((g, i) => (
                <div key={i} className="detail__cell">
                  <GalleryItem g={g} tone={project.tone} />
                </div>
              ))}
            </div>
          ) : (
            <div key={gi} className="detail__row detail__row--std">
              <GalleryItem g={group.items[0]} tone={project.tone} />
            </div>
          )
        )}
      </section>

      {/* Embeds */}
      {(project.youtube || project.soundcloud) && (
        <section className="detail__embeds">
          {project.youtube && (
            <div className="embed" style={{ textAlign: "center", alignItems: "stretch" }}>
              <div className="embed__head">
                <span className="embed__mono">[ {project.youtube} ]</span>
                <span className="embed__source">YouTube</span>
              </div>
              <div className="embed__frame embed__frame--video" style={{ padding: 0, overflow: "hidden" }}>
                {project.youtubeThumbId ? (
                  <iframe
                    style={{ width: "100%", aspectRatio: "16/9", border: "none", display: "block" }}
                    src={`https://www.youtube-nocookie.com/embed/${project.youtubeThumbId}?rel=0&modestbranding=1`}
                    title={project.youtube}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <><div className="embed__play">
                    <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                      <circle cx="32" cy="32" r="31" stroke="currentColor" strokeWidth="1" />
                      <polygon points="26,22 26,42 44,32" fill="currentColor" />
                    </svg>
                  </div>
                  <span className="embed__label">{project.youtube}</span></>
                )}
              </div>
            </div>
          )}
          {project.soundcloud && (
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
          )}
        </section>
      )}

      {/* Next project */}
      <section className="detail__next">
        <div className="detail__next-mono">[ Next project ]</div>
        <button className="detail__next-card" onClick={() => openProject(next.slug)}>
          <span className="detail__next-num">{String(projects.indexOf(next) + 1).padStart(2, "0")}</span>
          <span className="detail__next-title">{next.title}</span>
          <span className="detail__next-cat">{next.categoryLabel} — {next.year}</span>
          <span className="detail__next-arrow">→</span>
        </button>
      </section>
    </main>
  );
}

// Collapse the flat gallery list into runs: neighbouring portrait images become
// one multi-column group, anything else stays a group of one.
function groupGallery(gallery) {
  const groups = [];
  for (const g of gallery) {
    const isPortrait = !!g.portrait;
    const last = groups[groups.length - 1];
    if (isPortrait && last && last.portrait) last.items.push(g);
    else groups.push({ portrait: isPortrait, items: [g] });
  }
  return groups;
}

function GalleryItem({ g, tone }) {
  if (g.image && g.image.endsWith(".mp4")) {
    return (
      <div className="ph ph--image" style={{ overflow: "hidden", background: "var(--card-bg)" }}>
        <video src={g.image} autoPlay muted loop playsInline
               style={{ width: "100%", height: "auto", display: "block" }} />
      </div>
    );
  }
  if (g.image) {
    return (
      <div className="ph ph--image" style={{ overflow: "hidden", background: "var(--card-bg)" }}>
        <img src={g.image} alt={g.label} loading="lazy"
             style={{ width: "100%", height: "auto", display: "block" }} />
      </div>
    );
  }
  return (
    <Placeholder label={g.label} ratio={g.ratio} variant={g.variant} hue={g.hue} tone={tone} />
  );
}

Object.assign(window, { ProjectDetail });
