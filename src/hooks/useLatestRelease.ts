import { useState, useEffect } from "react";

const REPO = import.meta.env.VITE_GITHUB_REPO;
const RELEASE_CACHE_KEY = "ortu_latest_release_cache_v1";
const RELEASE_CACHE_TTL = 1000 * 60 * 30;

interface Asset {
  name: string;
  browser_download_url: string;
  download_count: number;
}

interface ReleaseData {
  tag_name: string;
  assets: Asset[];
}

interface CachedRelease {
  fetchedAt: number;
  data: ReleaseData;
}

export const useLatestRelease = () => {
  // Use a sensible default while loading
  const [downloadUrl, setDownloadUrl] = useState<string>(
    `https://github.com/${REPO}/releases/latest`
  );
  const [version, setVersion] = useState<string>("Latest");
  const [os, setOs] = useState<
    "mac" | "windows" | "linux" | "mobile" | "unknown"
  >("unknown");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [totalDownloads, setTotalDownloads] = useState<number>(0);

  useEffect(() => {
    const detectOS = () => {
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

    const applyReleaseData = (
      data: ReleaseData,
      detectedOs: "mac" | "windows" | "linux" | "mobile" | "unknown"
    ) => {
      setVersion(data.tag_name);

      if (data.assets) {
        const downloads = data.assets.reduce(
          (acc, asset) => acc + asset.download_count,
          0
        );
        setTotalDownloads(downloads);
      }

      if (!data.assets) {
        setDownloadUrl(`https://github.com/${REPO}/releases/tag/${data.tag_name}`);
        return;
      }

      let asset: Asset | undefined;

      if (detectedOs === "mac") {
        asset = data.assets.find((a) => a.name.endsWith(".dmg"));
      } else if (detectedOs === "windows") {
        asset =
          data.assets.find((a) => a.name.endsWith(".msi")) ||
          data.assets.find((a) => a.name.endsWith(".exe"));
      } else if (detectedOs === "linux") {
        asset = data.assets.find((a) => a.name.endsWith(".AppImage"));
      }

      if (!asset) {
        asset = data.assets.find((a) => a.name.endsWith(".dmg"));
      }

      if (asset) {
        setDownloadUrl(asset.browser_download_url);
      } else {
        setDownloadUrl(`https://github.com/${REPO}/releases/tag/${data.tag_name}`);
      }
    };

    const fetchRelease = async () => {
      const detectedOs = detectOS();
      setOs(detectedOs);

      try {
        const cachedRaw = localStorage.getItem(RELEASE_CACHE_KEY);
        if (cachedRaw) {
          const cached: CachedRelease = JSON.parse(cachedRaw);
          if (cached?.data?.tag_name) {
            applyReleaseData(cached.data, detectedOs);
            setIsLoading(false);
            if (Date.now() - cached.fetchedAt < RELEASE_CACHE_TTL) return;
          }
        }

        const response = await fetch(
          `https://api.github.com/repos/${REPO}/releases/latest`,
          {
            headers: {
              Accept: "application/vnd.github+json"
            }
          }
        );
        if (!response.ok) {
          throw new Error(`GitHub API error: ${response.status}`);
        }

        const data: ReleaseData = await response.json();
        localStorage.setItem(
          RELEASE_CACHE_KEY,
          JSON.stringify({ fetchedAt: Date.now(), data })
        );
        applyReleaseData(data, detectedOs);
      } catch (error) {
        console.error("Failed to fetch release:", error);
        // Keep default or fallback URL
      } finally {
        setIsLoading(false);
      }
    };

    fetchRelease();
  }, []);

  return { downloadUrl, version, os, isLoading, totalDownloads };
};
