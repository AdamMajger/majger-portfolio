// Work view — filters + masonry grid

const { useState: useWorkState } = React;

function Work({ projects, activeCat, setActiveCat, openProject, showCaptions, density }) {
  const filtered = activeCat === "all"
    ? projects
    : projects.filter((p) => p.category === activeCat);

  return (
    <main className="work">
      <section className="filters filters--top" aria-label="Project categories" style={{ borderWidth: "0px" }}>
        <div className="filters__row">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              className={"filter" + (activeCat === cat.id ? " filter--active" : "")}
              onClick={() => setActiveCat(cat.id)}>
              <span className="filter__label">{cat.label}</span>
            </button>
          ))}
        </div>
      </section>

      <section className={"grid grid--" + density} aria-label="Project grid">
        {filtered.map((p, i) => (
          <Card
            key={p.slug}
            project={p}
            onClick={() => openProject(p.slug)}
            index={i}
            showCaptions={showCaptions} />
        ))}
      </section>

      <section className="work__more">
        <div className="work__more-cta">
          <a className="big-link" href="mailto:adam.majger@gmail.com">adam.majger@gmail.com →</a>
        </div>
      </section>
    </main>
  );
}

function Card({ project, onClick, showCaptions }) {
  const [hovered, setHovered] = useWorkState(false);

  return (
    <article
      className={"card card--ratio-" + project.ratio.replace("/", "-")}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}>

      <div className="card__media">
        {project.image ?
          <div className="ph ph--image" style={{ aspectRatio: project.ratio.replace("/", " / "), overflow: "hidden", background: "var(--card-bg)" }}>
            <img src={project.image} alt={project.title} loading="lazy"
                 style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          </div>
        : project.youtubeThumbId ?
          <YouTubeThumbTile project={project} />
        : project.videoId ?
          <VideoTile project={project} />
        :
          <Placeholder
            label={project.placeholder}
            ratio={project.ratio}
            variant={project.variant}
            hue={project.hue}
            tone={project.tone}
            animate={project.animate} />
        }
        <div className={"card__overlay" + (hovered ? " card__overlay--on" : "")}>
          <span className="card__overlay-arrow">→</span>
        </div>
      </div>

      {showCaptions && (
        <div className="card__caption">
          <span className="card__title">{project.title}</span>
        </div>
      )}
    </article>
  );
}

function YouTubeThumbTile({ project }) {
  const id = project.youtubeThumbId;
  const [src, setSrc] = useWorkState(`https://i.ytimg.com/vi/${id}/maxresdefault.jpg`);

  return (
    <div className="ph ph--ytthumb" style={{ aspectRatio: project.ratio.replace("/", " / ") }}>
      <img
        className="ph__yt-img"
        src={src}
        alt={project.title}
        loading="lazy"
        onError={() => setSrc(`https://i.ytimg.com/vi/${id}/hqdefault.jpg`)}
      />
      <div className="ph__yt-play" aria-hidden="true">
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
          <circle cx="32" cy="32" r="31" fill="rgba(0,0,0,0.55)" stroke="rgba(255,255,255,0.85)" strokeWidth="1" />
          <polygon points="26,21 26,43 45,32" fill="rgba(255,255,255,0.95)" />
        </svg>
      </div>
    </div>
  );
}

function VideoTile({ project }) {
  const src =
    `https://www.youtube-nocookie.com/embed/${project.videoId}` +
    `?autoplay=1&mute=1&loop=1&playlist=${project.videoId}` +
    `&controls=0&modestbranding=1&playsinline=1&rel=0&disablekb=1&fs=0&iv_load_policy=3`;

  return (
    <div className="ph ph--video" style={{ aspectRatio: project.ratio.replace("/", " / ") }}>
      <iframe
        className="ph__iframe"
        src={src}
        title={project.title}
        frameBorder="0"
        allow="autoplay; encrypted-media; picture-in-picture"
        allowFullScreen={false}
        tabIndex={-1}
      />
      <div className="ph__shield" />
    </div>
  );
}

Object.assign(window, { Work });
