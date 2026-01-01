import { useState, useEffect } from 'react';

const REPO = import.meta.env.VITE_GITHUB_REPO;

interface Asset {
  name: string;
  browser_download_url: string;
}

interface ReleaseData {
  tag_name: string;
  assets: Asset[];
}

export const useLatestRelease = () => {
  // Use a sensible default while loading
  const [downloadUrl, setDownloadUrl] = useState<string>(`https://github.com/${REPO}/releases/latest`);
  const [version, setVersion] = useState<string>("Latest");
  const [os, setOs] = useState<"mac" | "windows" | "linux" | "mobile" | "unknown">("unknown");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const detectOS = () => {
      const userAgent = window.navigator.userAgent.toLowerCase();
      // Check for mobile devices first
      if (/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent)) {
        return "mobile";
      }
      if (userAgent.includes("mac")) return "mac";
      if (userAgent.includes("win")) return "windows";
      if (userAgent.includes("linux")) return "linux";
      return "unknown";
    };

    const fetchRelease = async () => {
      try {
        const detectedOs = detectOS();
        setOs(detectedOs);

        const response = await fetch(`https://api.github.com/repos/${REPO}/releases/latest`);
        if (!response.ok) {
           throw new Error(`GitHub API error: ${response.status}`);
        }
        
        const data: ReleaseData = await response.json();
        setVersion(data.tag_name);

        if (!data.assets) throw new Error("No assets found");

        let asset: Asset | undefined;

        if (detectedOs === "mac") {
          asset = data.assets.find((a) => a.name.endsWith(".dmg"));
        } else if (detectedOs === "windows") {
          asset = data.assets.find((a) => a.name.endsWith(".msi")) || data.assets.find((a) => a.name.endsWith(".exe"));
        } else if (detectedOs === "linux") {
          asset = data.assets.find((a) => a.name.endsWith(".AppImage"));
        }
        
        // Fallback to Mac asset if specific OS asset is not found (since currently only Mac is fully supported/released)
        if (!asset) {
           asset = data.assets.find((a) => a.name.endsWith(".dmg"));
        }

        if (asset) {
          setDownloadUrl(asset.browser_download_url);
        } else {
            // Fallback to the releases page if no specific asset is found
            setDownloadUrl(`https://github.com/${REPO}/releases/tag/${data.tag_name}`);
        }
      } catch (error) {
        console.error("Failed to fetch release:", error);
        // Keep default or fallback URL
      } finally {
        setIsLoading(false);
      }
    };

    fetchRelease();
  }, []);

  return { downloadUrl, version, os, isLoading };
};
