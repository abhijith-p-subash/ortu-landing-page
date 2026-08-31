/**
 * Notifies a phone each time Ortu's all-time download total crosses a new
 * milestone (every 10 by default).
 *
 * The landing page can't do this itself — it only runs when someone visits, in
 * their browser. This runs on a schedule instead, and remembers the last
 * milestone it announced so a total sitting at 851 for a week stays quiet.
 *
 * The counting rule is deliberately identical to `src/hooks/useLatestRelease.ts`:
 * only real installers count. If that list changes, change it here too, or the
 * number on your phone will disagree with the number on the site.
 */
import fs from 'fs';
import path from 'path';

const REPO = process.env.ORTU_REPO ?? 'abhijith-p-subash/ortu';
const STEP = Number(process.env.MILESTONE_STEP ?? 10);
const TOPIC = process.env.NTFY_TOPIC;
const STATE_DIR = '.milestone-state';
const STATE_FILE = path.join(STATE_DIR, 'last.json');

const INSTALLER_EXTENSIONS = ['.dmg', '.msi', '.exe', '.AppImage', '.deb', '.rpm'];
const PLATFORM_BY_EXTENSION = {
  '.dmg': 'macOS',
  '.msi': 'Windows',
  '.exe': 'Windows',
  '.AppImage': 'Linux',
  '.deb': 'Linux',
  '.rpm': 'Linux',
};

function platformFor(name) {
  const ext = INSTALLER_EXTENSIONS.find((e) => name.endsWith(e));
  return ext ? PLATFORM_BY_EXTENSION[ext] : null;
}

async function fetchTotals() {
  const headers = { Accept: 'application/vnd.github+json', 'User-Agent': 'ortu-milestone-watch' };
  // Authenticated calls get 1000/hour instead of 60, which matters when this
  // runs every half hour alongside whatever else touches the API.
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

  const res = await fetch(`https://api.github.com/repos/${REPO}/releases?per_page=100`, { headers });
  if (!res.ok) throw new Error(`GitHub API responded ${res.status}`);

  const releases = await res.json();
  if (!Array.isArray(releases) || !releases.length) throw new Error('GitHub returned no releases');

  const byPlatform = { macOS: 0, Windows: 0, Linux: 0 };
  let total = 0;

  for (const release of releases) {
    for (const asset of release.assets ?? []) {
      const platform = platformFor(asset.name);
      if (!platform) continue;
      const count = asset.download_count ?? 0;
      byPlatform[platform] += count;
      total += count;
    }
  }

  return { total, byPlatform };
}

/** The highest multiple of STEP that `total` has reached. */
const milestoneFor = (total) => Math.floor(total / STEP) * STEP;

function readLastMilestone() {
  try {
    return JSON.parse(fs.readFileSync(STATE_FILE, 'utf-8')).milestone ?? null;
  } catch {
    // No state yet: either the very first run, or the Actions cache was evicted.
    return null;
  }
}

function writeLastMilestone(milestone, total) {
  fs.mkdirSync(STATE_DIR, { recursive: true });
  fs.writeFileSync(
    STATE_FILE,
    JSON.stringify({ milestone, total, updatedAt: new Date().toISOString() }, null, 2),
  );
}

async function notify({ milestone, total, byPlatform }) {
  const breakdown = Object.entries(byPlatform)
    .filter(([, n]) => n > 0)
    .sort((a, b) => b[1] - a[1])
    .map(([label, n]) => `${label} ${n}`)
    .join('  ·  ');

  const res = await fetch(`https://ntfy.sh/${TOPIC}`, {
    method: 'POST',
    headers: {
      Title: `Ortu passed ${milestone} downloads`,
      Priority: 'default',
      Tags: 'tada',
      Click: `https://github.com/${REPO}/releases`,
    },
    body: `${total} all-time installs\n${breakdown}`,
  });

  if (!res.ok) throw new Error(`ntfy responded ${res.status}: ${await res.text()}`);
}

function summarize(lines) {
  console.log(lines.join('\n'));
  if (process.env.GITHUB_STEP_SUMMARY) {
    fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, lines.join('\n') + '\n');
  }
}

async function main() {
  if (!TOPIC) throw new Error('NTFY_TOPIC is not set — add it as a repository secret.');

  // Lets you prove the phone actually receives the push without waiting for a
  // real milestone, and without disturbing the recorded one.
  if (process.env.SEND_TEST === 'true') {
    const { total, byPlatform } = await fetchTotals();
    await notify({ milestone: milestoneFor(total), total, byPlatform });
    summarize([`Test notification sent (${total} downloads). Milestone state untouched.`]);
    return;
  }

  const { total, byPlatform } = await fetchTotals();
  const current = milestoneFor(total);
  const last = readLastMilestone();

  if (last === null) {
    // Seed silently. Announcing here would either spam every milestone since
    // zero or fire a duplicate for one already announced before a cache eviction.
    writeLastMilestone(current, total);
    summarize([`Seeded at ${total} downloads (milestone ${current}). No notification sent.`]);
    return;
  }

  if (current <= last) {
    summarize([`${total} downloads. Still at milestone ${last} — nothing to send.`]);
    return;
  }

  await notify({ milestone: current, total, byPlatform });
  writeLastMilestone(current, total);
  summarize([`Notified: crossed ${current} (${total} downloads, previously at ${last}).`]);
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
