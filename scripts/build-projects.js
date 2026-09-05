// Scans site/work/<category>/<project>/project.json files and
// generates site/projects.json. Run locally or via GitHub Actions.

const fs     = require("fs");
const path   = require("path");
const crypto = require("crypto");

const WORK_DIR = path.join(__dirname, "..", "site", "work");
const OUTPUT   = path.join(__dirname, "..", "site", "projects.json");

// Read pixel dimensions straight from the file header — PNG, JPEG and WebP.
// Done by hand rather than with a library so the GitHub Action can run plain
// `node` with no install step. Returns null for anything unrecognised.
function imageSize(file) {
  let buf;
  try { buf = fs.readFileSync(file); } catch { return null; }
  if (buf.length < 24) return null;

  // PNG: width/height are big-endian uint32s in the IHDR chunk
  if (buf.readUInt32BE(0) === 0x89504e47) {
    return { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) };
  }

  // WebP: "RIFF"…"WEBP", then a VP8 / VP8L / VP8X chunk
  if (buf.toString("ascii", 0, 4) === "RIFF" && buf.toString("ascii", 8, 12) === "WEBP") {
    const chunk = buf.toString("ascii", 12, 16);
    if (chunk === "VP8 ") {
      return { w: buf.readUInt16LE(26) & 0x3fff, h: buf.readUInt16LE(28) & 0x3fff };
    }
    if (chunk === "VP8L") {
      const b = buf.readUInt32LE(21);
      return { w: (b & 0x3fff) + 1, h: ((b >> 14) & 0x3fff) + 1 };
    }
    if (chunk === "VP8X") {
      const rd24 = (o) => buf[o] | (buf[o + 1] << 8) | (buf[o + 2] << 16);
      return { w: rd24(24) + 1, h: rd24(27) + 1 };
    }
    return null;
  }

  // JPEG: walk the marker segments looking for a start-of-frame
  if (buf[0] === 0xff && buf[1] === 0xd8) {
    let off = 2;
    while (off + 9 < buf.length) {
      if (buf[off] !== 0xff) { off++; continue; }
      const marker = buf[off + 1];
      // SOF0-SOF15, excluding DHT/JPG/DAC which share the range
      if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
        return { h: buf.readUInt16BE(off + 5), w: buf.readUInt16BE(off + 7) };
      }
      off += 2 + buf.readUInt16BE(off + 2);
    }
  }
  return null;
}

// "1080x1350" -> "4/5", so the CSS aspect-ratio stays human-readable
function ratioString(w, h) {
  const gcd = (a, b) => (b ? gcd(b, a % b) : a);
  const g = gcd(w, h);
  return `${w / g}/${h / g}`;
}

const CATEGORY_LABELS = {
  design: "Design",
  events: "Events",
  ads:    "Ads",
  music:  "Music",
};

const projects = [];

const categories = fs.readdirSync(WORK_DIR)
  .filter(f => fs.statSync(path.join(WORK_DIR, f)).isDirectory())
  .sort();

for (const category of categories) {
  const catDir = path.join(WORK_DIR, category);

  const slugs = fs.readdirSync(catDir)
    .filter(f => fs.statSync(path.join(catDir, f)).isDirectory())
    .sort();

  for (const slug of slugs) {
    const metaPath = path.join(catDir, slug, "project.json");
    if (!fs.existsSync(metaPath)) {
      console.warn(`  skipping ${category}/${slug} — no project.json`);
      continue;
    }

    let meta;
    try {
      meta = JSON.parse(fs.readFileSync(metaPath, "utf8"));
    } catch (e) {
      console.error(`  ERROR: invalid JSON in ${category}/${slug}/project.json`);
      console.error("  ", e.message);
      process.exit(1);
    }

    const imgBase = `work/${category}/${slug}/`;
    const projectDir = path.join(catDir, slug);

    // If a .webp version exists alongside a file, use it instead
    function preferWebp(file) {
      const webp = file.replace(/\.(jpg|jpeg|png)$/i, ".webp");
      return fs.existsSync(path.join(projectDir, webp)) ? webp : file;
    }

    // Resolve gallery entries: { file } → { image }; placeholder entries pass through.
    // The real pixel size wins over any hand-written ratio, and portrait images are
    // flagged so the page can lay them out several per row.
    const gallery = (meta.gallery || []).map(g => {
      if (g.file) {
        const { file, ...rest } = g;
        const served = preferWebp(file);
        const size = imageSize(path.join(projectDir, served));
        const out = { ...rest, image: imgBase + served };
        if (size) {
          out.ratio = ratioString(size.w, size.h);
          if (size.h > size.w) out.portrait = true;
        }
        return out;
      }
      return g;
    });

    const project = {
      slug,
      title:         meta.title,
      category,
      categoryLabel: CATEGORY_LABELS[category] || category,
      year:          meta.year,
      client:        meta.client,
      authors:       meta.authors || "Majger",
      ratio:         meta.ratio   || "4/5",
      placeholder:   meta.placeholder || slug,
      description:   meta.description || "",
      role:          meta.role        || "",
      duration:      meta.duration    || "",
      gallery,
      youtube:       meta.youtube    ?? null,
      soundcloud:    meta.soundcloud ?? null,
    };

    // Optional media fields — only added when present
    if (meta.thumbnail)      project.image          = imgBase + preferWebp(meta.thumbnail);
    if (meta.youtubeThumbId) project.youtubeThumbId = meta.youtubeThumbId;
    if (meta.videoId)        project.videoId        = meta.videoId;

    // Optional placeholder appearance fields
    if (meta.variant  !== undefined) project.variant = meta.variant;
    if (meta.hue      !== undefined) project.hue     = meta.hue;
    if (meta.tone)                   project.tone    = meta.tone;
    if (meta.animate  !== undefined) project.animate = meta.animate;

    projects.push(project);
  }
}

// Sort: pinned projects first (order field), then newest year first, then alphabetically
projects.sort((a, b) => {
  const oa = a.order ?? 999;
  const ob = b.order ?? 999;
  if (oa !== ob) return oa - ob;
  if (b.year !== a.year) return b.year - a.year;
  return a.slug.localeCompare(b.slug);
});

// Remove internal order field from output
projects.forEach(p => delete p.order);

fs.writeFileSync(OUTPUT, JSON.stringify(projects, null, 2) + "\n");
console.log(`✓ projects.json — ${projects.length} projects`);

// Cache busting: stamp each local .jsx / .css reference in index.html with a
// short hash of that file's contents, so browsers refetch a file only when it
// actually changed. Re-running with no edits produces an identical index.html,
// which keeps the build idempotent and avoids empty commits.
const SITE  = path.join(__dirname, "..", "site");
const INDEX = path.join(SITE, "index.html");

const hashOf = (file) => {
  const full = path.join(SITE, file);
  if (!fs.existsSync(full)) return null;
  return crypto.createHash("sha1").update(fs.readFileSync(full)).digest("hex").slice(0, 8);
};

let html = fs.readFileSync(INDEX, "utf8");
let stamped = 0;

html = html.replace(
  /((?:href|src)=")([^"?]+\.(?:jsx|css))(?:\?v=[^"]*)?(")/g,
  (match, prefix, file, suffix) => {
    const hash = hashOf(file);
    if (!hash) return match;
    stamped++;
    return `${prefix}${file}?v=${hash}${suffix}`;
  }
);

fs.writeFileSync(INDEX, html);
console.log(`✓ index.html — ${stamped} assets cache-stamped`);
