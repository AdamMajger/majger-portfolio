// MAJGER — project data + placeholder visuals

const CATEGORIES = [
  { id: "all",    label: "All" },
  { id: "design", label: "Design" },
  { id: "events", label: "Events" },
  { id: "ads",    label: "Ads" },
  { id: "music",  label: "Music" },
];

// Atmospheric monochrome placeholder. Two hues, fine stripes, label slot.
function Placeholder({ label, ratio = "4/5", variant = 0, hue = 30, tone = "dark", animate = null, accent = "#e8ff3a" }) {
  const bg = tone === "dark"
    ? `oklch(0.18 0.01 ${hue})`
    : tone === "mid"
      ? `oklch(0.28 0.015 ${hue})`
      : `oklch(0.92 0.008 ${hue})`;
  const fg = tone === "light"
    ? `oklch(0.22 0.012 ${hue})`
    : `oklch(0.38 0.02 ${hue})`;
  const muted = tone === "light"
    ? `oklch(0.55 0.012 ${hue})`
    : `oklch(0.58 0.012 ${hue})`;

  const stripeAngle = [0, 90, 45, 12, -22, 78][variant % 6];
  const stripeGap   = [6, 11, 4, 18, 9, 14][variant % 6];

  return (
    <div className={`ph ph--${animate || "static"}`} style={{
      aspectRatio: ratio.replace("/", " / "),
      background: bg,
      position: "relative",
      overflow: "hidden",
      width: "100%",
    }}>
      <svg width="100%" height="100%" viewBox="0 0 400 500" preserveAspectRatio="none"
           style={{ position: "absolute", inset: 0, display: "block" }}>
        <defs>
          <pattern id={`stripes-${variant}-${hue}-${tone}`} patternUnits="userSpaceOnUse"
                   width={stripeGap} height={stripeGap}
                   patternTransform={`rotate(${stripeAngle})`}>
            <line x1="0" y1="0" x2="0" y2={stripeGap}
                  stroke={fg} strokeWidth="1" strokeOpacity="0.55" />
          </pattern>
        </defs>
        <rect width="400" height="500" fill={`url(#stripes-${variant}-${hue}-${tone})`} />
        {variant === 0 && <circle cx="200" cy="250" r="80" fill="none" stroke={muted} strokeWidth="1" />}
        {variant === 1 && <rect x="80" y="140" width="240" height="220" fill="none" stroke={muted} strokeWidth="1" />}
        {variant === 2 && <line x1="40" y1="40" x2="360" y2="460" stroke={muted} strokeWidth="1" />}
        {variant === 3 && <>
          <line x1="0" y1="250" x2="400" y2="250" stroke={muted} strokeWidth="1" />
          <line x1="200" y1="0" x2="200" y2="500" stroke={muted} strokeWidth="1" />
        </>}
        {variant === 4 && <circle cx="200" cy="250" r="140" fill="none" stroke={muted} strokeWidth="1" strokeDasharray="2 6" />}
        {variant === 5 && <polygon points="200,80 340,420 60,420" fill="none" stroke={muted} strokeWidth="1" />}
      </svg>
      {animate === "marquee" && (
        <div className="ph__marquee" style={{
          position: "absolute",
          top: "50%",
          left: 0,
          right: 0,
          transform: "translateY(-50%)",
          whiteSpace: "nowrap",
          fontFamily: "var(--display)",
          fontSize: 64,
          fontWeight: 700,
          color: fg,
          opacity: 0.6,
          letterSpacing: "-0.02em",
          pointerEvents: "none",
        }}>
          <span>{label.toUpperCase()} · {label.toUpperCase()} · {label.toUpperCase()} · </span>
        </div>
      )}
      {animate === "pulse" && (
        <div className="ph__pulse" style={{
          position: "absolute",
          left: "50%", top: "50%",
          transform: "translate(-50%, -50%)",
          width: "30%",
          aspectRatio: "1 / 1",
          borderRadius: "50%",
          background: accent,
          mixBlendMode: "screen",
          opacity: 0.35,
          filter: "blur(8px)",
          pointerEvents: "none",
        }} />
      )}
    </div>
  );
}

// Projects are loaded from projects.json — see app.jsx fetch()
const PROJECTS_PLACEHOLDER = [
  {
    slug: "garaz",
    title: "Garáž",
    category: "design",
    categoryLabel: "Design",
    year: 2026,
    client: "Trenčín 2026 — Európske hlavné mesto kultúry",
    authors: "Majger",
    ratio: "4/5",
    image: "images/garaz-thumbnail.jpg",
    placeholder: "garáž",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore.",
    role: "Identity, posters, social",
    duration: "2026",
    gallery: [
      { ratio: "4/5", image: "images/garaz-thumbnail.jpg", label: "key visual — garážou to začína" },
      { ratio: "4/5", image: "images/garaz-porota.png",    label: "porota — jury reveal" },
      { ratio: "4/5", image: "images/garaz-lineup.jpg",    label: "line-up announcement" },
    ],
    youtube: null,
    soundcloud: null,
  },
  {
    slug: "nocturno-mv",
    title: "Nocturno — music video",
    category: "music",
    categoryLabel: "Music",
    year: 2025,
    client: "Self-released",
    authors: "Majger / Dir: T. Hraška",
    ratio: "16/9",
    youtubeThumbId: "e6ku-fpp16s",
    placeholder: "music video",
    description: "Music-video direction and visual identity for the single 'Nocturno'. Shot over one night in three locations across central Bratislava — an empty multi-storey carpark, an underpass, and a rooftop on Račianska. The cover art and lyric video reuse the same three frames, regraded and retitled.",
    role: "Direction, identity, lyric video",
    duration: "Feb 2025",
    gallery: [
      { ratio: "16/9", variant: 0, hue: 24, label: "stills — carpark" },
      { ratio: "3/4",  variant: 2, hue: 24, label: "cover art" },
      { ratio: "16/9", variant: 4, hue: 24, label: "stills — rooftop" },
    ],
    youtube: "music video — 3:48",
    soundcloud: "Nocturno — single",
  },
  {
    slug: "pohlad-na-noc",
    title: "Pohľad na noc",
    category: "music",
    categoryLabel: "Music",
    year: 2025,
    client: "Stará tržnica, Bratislava",
    authors: "Majger / Foto: B. Sedláková",
    ratio: "4/5",
    variant: 0,
    hue: 28,
    tone: "dark",
    animate: "pulse",
    placeholder: "concert poster",
    description: "A nocturnal concert series held in the high-vaulted Stará Tržnica through the autumn months. The identity leans on a single graphic mark that mutates across posters, programmes and stage projection — a quiet, repeated gesture against the noise of the city outside.",
    role: "Identity, posters, stage visuals",
    duration: "Sep — Nov 2025",
    gallery: [
      { ratio: "16/9", variant: 1, hue: 28, label: "stage projection still" },
      { ratio: "3/4",  variant: 2, hue: 28, label: "poster A2" },
      { ratio: "3/4",  variant: 4, hue: 28, label: "poster A2 — variant" },
      { ratio: "21/9", variant: 3, hue: 28, label: "venue install" },
    ],
    youtube: "case-study reel — 1:42",
    soundcloud: "set / atmosphere — 38 min",
  },
  {
    slug: "garaz-49",
    title: "Garáž 49",
    category: "events",
    categoryLabel: "Events",
    year: 2024,
    client: "Garáž 49 / Self-initiated",
    authors: "Majger / Light: J. Krištof",
    ratio: "4/3",
    variant: 1,
    hue: 24,
    tone: "dark",
    animate: "shift",
    placeholder: "garage interior",
    description: "Three nights of experimental sound staged inside an abandoned commercial garage on the edge of Petržalka. The visual language responded to what was already there — chipped paint, cable conduits, fluorescent strips — and added almost nothing.",
    role: "Spatial concept, signage, print",
    duration: "Apr 2024",
    gallery: [
      { ratio: "16/9", variant: 0, hue: 24, label: "interior wide" },
      { ratio: "1/1",  variant: 5, hue: 24, label: "wayfinding sticker" },
      { ratio: "4/5",  variant: 2, hue: 24, label: "programme zine" },
    ],
    youtube: "documentation — 2:08",
    soundcloud: "night 02 — full set",
  },
  {
    slug: "sv-katarina",
    title: "Kostol sv. Kataríny",
    category: "events",
    categoryLabel: "Events",
    year: 2024,
    client: "Konvent klarisiek, Bratislava",
    authors: "Majger w/ Studio Plân",
    ratio: "3/4",
    variant: 4,
    hue: 32,
    tone: "dark",
    animate: null,
    placeholder: "church nave",
    description: "A one-evening sound and projection piece staged in the disused 14th-century Church of St. Catherine. The visual material was generated from rubbings of the floor stones, then redrawn for projection across the vault.",
    role: "Visual direction, projection content",
    duration: "Oct 2024",
    gallery: [
      { ratio: "21/9", variant: 3, hue: 32, label: "nave projection" },
      { ratio: "3/4",  variant: 1, hue: 32, label: "rubbing 04" },
      { ratio: "1/1",  variant: 0, hue: 32, label: "programme cover" },
    ],
    youtube: "evening recording — 14:50",
    soundcloud: null,
  },
  {
    slug: "letne-kino-tehelne-pole",
    title: "Letné kino, Tehelné pole",
    category: "ads",
    categoryLabel: "Ads",
    year: 2024,
    client: "Mesto Bratislava",
    authors: "Majger / Architecture: Plural",
    ratio: "16/9",
    variant: 3,
    hue: 22,
    tone: "dark",
    animate: "marquee",
    placeholder: "outdoor cinema",
    videoId: "WjJTNZQUVAo",
    description: "Identity, signage and programme for the third edition of the open-air summer cinema at Tehelné pole. The system is built for outdoor rain and quick swap-outs — laminated A1 boards, two stencils, a single yellow.",
    role: "Identity, signage, programme",
    duration: "Jun — Aug 2024",
    gallery: [
      { ratio: "16/9", variant: 0, hue: 22, label: "field at dusk" },
      { ratio: "3/4",  variant: 5, hue: 22, label: "programme A3" },
      { ratio: "1/1",  variant: 2, hue: 22, label: "stencil sheet" },
      { ratio: "16/9", variant: 4, hue: 22, label: "screen detail" },
    ],
    youtube: "season recap — 2:21",
    soundcloud: null,
  },
  {
    slug: "tatry-sessions",
    title: "Tatry Sessions",
    category: "music",
    categoryLabel: "Music",
    year: 2023,
    client: "Tatry Sessions o.z.",
    authors: "Majger",
    ratio: "1/1",
    variant: 2,
    hue: 26,
    tone: "mid",
    animate: null,
    placeholder: "session poster",
    description: "Five intimate concerts in mountain chalets across the High Tatras, one per peak. Each poster is a different stenographic abstraction of its mountain's silhouette, rendered as a low-resolution dot grid.",
    role: "Identity, posters, web",
    duration: "Summer 2023",
    gallery: [
      { ratio: "3/4", variant: 1, hue: 26, label: "Kriváň poster" },
      { ratio: "3/4", variant: 4, hue: 26, label: "Lomnický štít" },
      { ratio: "3/4", variant: 5, hue: 26, label: "Gerlachovský" },
    ],
    youtube: null,
    soundcloud: "Session 03 — live at Téryho",
  },
  {
    slug: "burina",
    title: "Burina",
    category: "events",
    categoryLabel: "Events",
    year: 2025,
    client: "Divadlo NUDE, Košice",
    authors: "Majger / Director: V. Bárdoš",
    ratio: "3/4",
    variant: 5,
    hue: 30,
    tone: "dark",
    animate: null,
    placeholder: "theatre poster",
    description: "Visual identity for a chamber play about an overgrown garden that won't be tamed. The title is set in a single overgrown weight that thickens and tangles across each printed piece, the typography itself going to seed.",
    role: "Identity, poster, programme",
    duration: "Mar 2025",
    gallery: [
      { ratio: "3/4",  variant: 0, hue: 30, label: "A1 poster" },
      { ratio: "16/9", variant: 2, hue: 30, label: "lobby banner" },
      { ratio: "1/1",  variant: 4, hue: 30, label: "social tile" },
    ],
    youtube: "trailer — 0:42",
    soundcloud: null,
  },
  {
    slug: "biela-noc",
    title: "Biela noc — Stredisko",
    category: "ads",
    categoryLabel: "Ads",
    year: 2023,
    client: "Biela noc",
    authors: "Majger / Production: BN",
    ratio: "21/9",
    variant: 3,
    hue: 20,
    tone: "dark",
    animate: "pulse",
    placeholder: "festival hub",
    videoId: "aqz-KE-bpKQ",
    description: "A nighttime city-wide art festival, and the central hub on Hviezdoslavovo námestie. The system uses one custom display face and one yellow, painted directly on the pavement, scaffolds and water tanks.",
    role: "Festival hub identity, signage",
    duration: "Oct 2023",
    gallery: [
      { ratio: "21/9", variant: 0, hue: 20, label: "hub aerial" },
      { ratio: "3/4",  variant: 1, hue: 20, label: "scaffold sign" },
      { ratio: "1/1",  variant: 5, hue: 20, label: "wayfinding" },
    ],
    youtube: "night recap — 3:10",
    soundcloud: "ambience loop — 22 min",
  },
  {
    slug: "kamenny-mlyn",
    title: "Kamenný mlyn",
    category: "music",
    categoryLabel: "Music",
    year: 2024,
    client: "Self-initiated / Mlyn Kvačany",
    authors: "Majger",
    ratio: "4/5",
    variant: 0,
    hue: 34,
    tone: "dark",
    animate: null,
    placeholder: "stone mill",
    description: "Two acoustic nights inside a working watermill in Liptov. The whole identity is one poster, screenprinted on offcuts of millstone-grey paper, in editions of forty.",
    role: "Identity, screenprint",
    duration: "Jul 2024",
    gallery: [
      { ratio: "3/4",  variant: 2, hue: 34, label: "screenprint — night 1" },
      { ratio: "3/4",  variant: 4, hue: 34, label: "screenprint — night 2" },
      { ratio: "16/9", variant: 5, hue: 34, label: "venue interior" },
    ],
    youtube: null,
    soundcloud: "Night 02 — Bára Vrkočová",
  },
  {
    slug: "mestske-divadlo",
    title: "Mestské Divadlo — 24/25",
    category: "events",
    categoryLabel: "Events",
    year: 2024,
    client: "Mestské Divadlo Žilina",
    authors: "Majger / Studio Marno",
    ratio: "4/3",
    variant: 1,
    hue: 30,
    tone: "dark",
    animate: null,
    placeholder: "season identity",
    description: "Season identity for the 24/25 programme — six productions, six covers, one shared modular grid. Each cover is a single photographic motif crossed by the same fine yellow ruling.",
    role: "Season identity, programmes",
    duration: "Aug 2024",
    gallery: [
      { ratio: "3/4", variant: 0, hue: 30, label: "programme A — cover" },
      { ratio: "3/4", variant: 3, hue: 30, label: "programme B" },
      { ratio: "3/4", variant: 5, hue: 30, label: "programme C" },
      { ratio: "3/4", variant: 4, hue: 30, label: "programme D" },
    ],
    youtube: "season trailer — 1:08",
    soundcloud: null,
  },
  {
    slug: "blok-7",
    title: "Blok 7",
    category: "events",
    categoryLabel: "Events",
    year: 2023,
    client: "Petržalka Anti-Conference",
    authors: "Majger",
    ratio: "3/4",
    variant: 2,
    hue: 26,
    tone: "dark",
    animate: "shift",
    placeholder: "concrete block",
    description: "A two-day anti-conference held inside the unused ground floor of a panel-block in Petržalka. The visual material is a single typewritten programme, photocopied to ninth-generation degradation.",
    role: "Print, signage",
    duration: "Nov 2023",
    gallery: [
      { ratio: "1/1",  variant: 1, hue: 26, label: "programme cover" },
      { ratio: "3/4",  variant: 4, hue: 26, label: "interior signage" },
    ],
    youtube: null,
    soundcloud: null,
  },
  {
    slug: "studio-jednotky",
    title: "Studio Jednotky",
    category: "design",
    categoryLabel: "Design",
    year: 2025,
    client: "Studio Jednotky",
    authors: "Majger",
    ratio: "1/1",
    variant: 5,
    hue: 32,
    tone: "dark",
    animate: null,
    placeholder: "identity system",
    description: "Identity for a two-person architecture practice working between Bratislava and Brno. A single wordmark, set very tight, and a numbered system of stationery — every printed piece carries its sequence number.",
    role: "Identity, stationery, web",
    duration: "Jan 2025",
    gallery: [
      { ratio: "16/9", variant: 0, hue: 32, label: "letterhead" },
      { ratio: "1/1",  variant: 2, hue: 32, label: "card 001 / 100" },
      { ratio: "3/4",  variant: 3, hue: 32, label: "tote" },
    ],
    youtube: null,
    soundcloud: null,
  },
  {
    slug: "nizke-tatry-zine",
    title: "Nízke Tatry — zine 02",
    category: "design",
    categoryLabel: "Design",
    year: 2024,
    client: "Self-initiated",
    authors: "Majger / Photo: P. Vavrek",
    ratio: "3/4",
    variant: 4,
    hue: 28,
    tone: "dark",
    animate: null,
    placeholder: "zine spread",
    description: "Second issue of a self-published photo zine documenting unmarked trails through the Low Tatras. 48 pages, two-colour risograph, edition of 200.",
    role: "Editorial, print",
    duration: "Sep 2024",
    gallery: [
      { ratio: "3/4",  variant: 0, hue: 28, label: "cover" },
      { ratio: "16/9", variant: 1, hue: 28, label: "spread 12-13" },
      { ratio: "16/9", variant: 5, hue: 28, label: "spread 28-29" },
    ],
    youtube: null,
    soundcloud: null,
  },
];

const AWARDS = [
  { year: 2025, title: "National Design Award SK",      category: "Visual Identity",                         project: "Burina" },
  { year: 2025, title: "Type Directors Club, NYC",      category: "Certificate of Excellence",               project: "Pohľad na noc" },
  { year: 2024, title: "European Design Awards",        category: "Silver — Posters",                        project: "Letné kino" },
  { year: 2024, title: "Slovak Design Centre",          category: "Project of the Year — Shortlist",         project: "Garáž 49" },
  { year: 2023, title: "Bienále Brno",                  category: "Honourable Mention",                      project: "Biela noc — Stredisko" },
  { year: 2023, title: "Czech Grand Design",            category: "Nomination — Graphic Designer of the Year", project: "—" },
  { year: 2022, title: "Národná cena za dizajn",        category: "Young Designer",                          project: "—" },
];

const CV = [
  { period: "2023 — present",      role: "Art Director",                                          place: "European Capital of Culture Trenčín 2026" },
  { period: "2015 — 2023",         role: "Junior Designer → Art Director",                        place: "Triad Advertising" },
  { period: "2015 — 2026",         role: "Co-Founder, Designer, Cleaner, Driver, Chef, Ideamaker", place: "Festival Hviezdne noci" },
  { period: "FEB 2014 — SEP 2014", role: "Internship - Graphic Designer",                         place: "CEIT TI" },
  { period: "2013 — 2014",         role: "Graphic Designer",                                      place: "Film Club Bytča" },
];

Object.assign(window, { CATEGORIES, AWARDS, CV, Placeholder });
