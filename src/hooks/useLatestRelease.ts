import { useState, useEffect, useCallback } from "react";

const REPO = import.meta.env.VITE_GITHUB_REPO;
const RELEASE_CACHE_KEY = "ortu_releases_cache_v2";
const RELEASE_CACHE_TTL = 1000 * 60 * 30;

// One call to /releases gives us both the latest release and every past one,
// so the all-time download total costs no extra GitHub API budget.
const RELEASES_URL = `https://api.github.com/repos/${REPO}/releases?per_page=100`;

// Only real installers count as a download. `latest.json` is the updater
// manifest every running copy of Ortu polls, `.sig` files ship alongside each
// artifact, and `*.app.tar.gz` is the macOS auto-update bundle — none of them
// are a person choosing to install Ortu, so counting them would inflate the
// number we put in front of visitors.
const PLATFORM_BY_EXTENSION: { ext: string; platform: PlatformKey }[] = [
  { ext: ".dmg", platform: "mac" },
  { ext: ".msi", platform: "windows" },
  { ext: ".exe", platform: "windows" },
  { ext: ".AppImage", platform: "linux" },
  { ext: ".deb", platform: "linux" },
  { ext: ".rpm", platform: "linux" }
];

const PLATFORM_LABELS: Record<PlatformKey, string> = {
  mac: "macOS",
  windows: "Windows",
  linux: "Linux"
};

export type PlatformKey = "mac" | "windows" | "linux";
export type OsKey = PlatformKey | "mobile" | "unknown";

export interface PlatformStat {
  key: PlatformKey;
  label: string;
  downloads: number;
}

export interface ReleaseStat {
  tag: string;
  downloads: number;
}

export interface DownloadStats {
  total: number;
  platforms: PlatformStat[];
  releases: ReleaseStat[];
  releaseCount: number;
  /** Set when the numbers came from localStorage rather than a fresh call. */
  fromCache: boolean;
  fetchedAt: number | null;
}

const EMPTY_STATS: DownloadStats = {
  total: 0,
  platforms: [],
  releases: [],
  releaseCount: 0,
  fromCache: false,
  fetchedAt: null
};

interface Asset {
  name: string;
  browser_download_url: string;
  download_count: number;
}

interface ReleaseData {
  tag_name: string;
  draft?: boolean;
  prerelease?: boolean;
  assets: Asset[];
}

interface CachedReleases {
  fetchedAt: number;
  data: ReleaseData[];
}

/** Maps an asset filename to the platform it installs, or null if it isn't an installer. */
const platformFor = (name: string): PlatformKey | null =>
  PLATFORM_BY_EXTENSION.find(({ ext }) => name.endsWith(ext))?.platform ?? null;

/**
 * Keeps only the fields we read — the raw /releases payload is far larger
 * than what belongs in localStorage.
 */
const trimRelease = (release: ReleaseData): ReleaseData => ({
  tag_name: release.tag_name,
  draft: release.draft,
  prerelease: release.prerelease,
  assets: (release.assets ?? []).map((asset) => ({
    name: asset.name,
    browser_download_url: asset.browser_download_url,
    download_count: asset.download_count
  }))
});

/** Rolls every published release up into the totals the UI renders. */
const buildStats = (
  releases: ReleaseData[],
  meta: { fromCache: boolean; fetchedAt: number }
): DownloadStats => {
  const byPlatform: Record<PlatformKey, number> = {
    mac: 0,
    windows: 0,
    linux: 0
  };
  const perRelease: ReleaseStat[] = [];
  let total = 0;

  for (const release of releases) {
    let releaseTotal = 0;

    for (const asset of release.assets ?? []) {
      const platform = platformFor(asset.name);
      if (!platform) continue;
      const count = asset.download_count ?? 0;
      byPlatform[platform] += count;
      releaseTotal += count;
    }

    total += releaseTotal;
    perRelease.push({ tag: release.tag_name, downloads: releaseTotal });
  }

  return {
    total,
    platforms: (Object.keys(byPlatform) as PlatformKey[])
      .map((key) => ({
        key,
        label: PLATFORM_LABELS[key],
        downloads: byPlatform[key]
      }))
      .sort((a, b) => b.downloads - a.downloads),
    releases: perRelease,
    releaseCount: releases.length,
    fromCache: meta.fromCache,
    fetchedAt: meta.fetchedAt
  };
};

const detectOS = (): OsKey => {
  const userAgent = window.navigator.userAgent.toLowerCase();
  // Check for mobile devices first
  if (
    /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
      userAgent
    )
  ) {
    return "mobile";
  }
  if (userAgent.includes("mac")) return "mac";
  if (userAgent.includes("win")) return "windows";
  if (userAgent.includes("linux")) return "linux";
  return "unknown";
};

// Navbar and the hero each mount this hook, and the stats terminal can ask for
// a refresh while one is already in the air. Sharing the in-flight promise
// keeps that to a single request against the 60/hour unauthenticated budget.
let inFlight: Promise<ReleaseData[]> | null = null;

const fetchReleases = () => {
  inFlight ??= fetch(RELEASES_URL, {
    headers: { Accept: "application/vnd.github+json" }
  })
    .then(async (response) => {
      if (!response.ok) throw new Error(`GitHub API error: ${response.status}`);
      const data: ReleaseData[] = await response.json();
      if (!Array.isArray(data) || !data.length) {
        throw new Error("GitHub returned no releases");
      }
      return data.map(trimRelease);
    })
    .finally(() => {
      inFlight = null;
    });

  return inFlight;
};

export const useLatestRelease = () => {
  // Use a sensible default while loading
  const [downloadUrl, setDownloadUrl] = useState<string>(
    `https://github.com/${REPO}/releases/latest`
  );
  const [version, setVersion] = useState<string>("Latest");
  const [os, setOs] = useState<OsKey>("unknown");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [stats, setStats] = useState<DownloadStats>(EMPTY_STATS);

  const applyReleases = useCallback(
    (releases: ReleaseData[], detectedOs: OsKey, meta: { fromCache: boolean; fetchedAt: number }) => {
      setStats(buildStats(releases, meta));

      // GitHub returns releases newest-first, so the first stable one is what
      // /releases/latest would have handed us.
      const latest =
        releases.find((release) => !release.draft && !release.prerelease) ??
        releases[0];

      if (!latest) return;

      setVersion(latest.tag_name);

      const tagUrl = `https://github.com/${REPO}/releases/tag/${latest.tag_name}`;

      if (!latest.assets) {
        setDownloadUrl(tagUrl);
        return;
      }

      let asset: Asset | undefined;

      if (detectedOs === "mac") {
        asset = latest.assets.find((a) => a.name.endsWith(".dmg"));
      } else if (detectedOs === "windows") {
        asset =
          latest.assets.find((a) => a.name.endsWith(".msi")) ||
          latest.assets.find((a) => a.name.endsWith(".exe"));
      } else if (detectedOs === "linux") {
        asset = latest.assets.find((a) => a.name.endsWith(".AppImage"));
      }

      asset ??= latest.assets.find((a) => a.name.endsWith(".dmg"));

      setDownloadUrl(asset ? asset.browser_download_url : tagUrl);
    },
    []
  );

  /**
   * @param force skips the localStorage TTL so the stats terminal can show a
   *              genuinely live number when the visitor asks for one.
   */
  const load = useCallback(
    async ({ force = false }: { force?: boolean } = {}) => {
      const detectedOs = detectOS();
      setOs(detectedOs);

      try {
        const cachedRaw = localStorage.getItem(RELEASE_CACHE_KEY);
        if (cachedRaw) {
          const cached: CachedReleases = JSON.parse(cachedRaw);
          if (Array.isArray(cached?.data) && cached.data.length) {
            applyReleases(cached.data, detectedOs, {
              fromCache: true,
              fetchedAt: cached.fetchedAt
            });
            setIsLoading(false);
            if (!force && Date.now() - cached.fetchedAt < RELEASE_CACHE_TTL) {
              return;
            }
          }
        }

        const releases = await fetchReleases();
        const fetchedAt = Date.now();

        localStorage.setItem(
          RELEASE_CACHE_KEY,
          JSON.stringify({ fetchedAt, data: releases })
        );
        applyReleases(releases, detectedOs, { fromCache: false, fetchedAt });
      } catch (error) {
        console.error("Failed to fetch releases:", error);
        // Keep whatever the cache gave us, or the fallback URL.
      } finally {
        setIsLoading(false);
      }
    },
    [applyReleases]
  );

  useEffect(() => {
    load();
  }, [load]);

  const refresh = useCallback(() => load({ force: true }), [load]);

  return {
    downloadUrl,
    version,
    os,
    isLoading,
    stats,
    totalDownloads: stats.total,
    refresh
  };
};
