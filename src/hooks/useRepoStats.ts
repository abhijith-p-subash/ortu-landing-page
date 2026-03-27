import { useEffect, useState } from "react";

const REPO = import.meta.env.VITE_GITHUB_REPO;
const CACHE_KEY = "ortu_repo_stats_cache_v1";
const CACHE_TTL = 1000 * 60 * 30; // 30 minutes

interface RepoStats {
  stars: number;
}

interface CachedStats {
  fetchedAt: number;
  data: RepoStats;
}

/**
 * Lightweight GitHub repo stats fetcher with localStorage caching.
 * Keeps traffic low while still updating stars regularly for visitors.
 */
export const useRepoStats = () => {
  const [stars, setStars] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const applyStats = (data: RepoStats) => {
      setStars(data.stars ?? 0);
    };

    const fetchStats = async () => {
      try {
        const cachedRaw = localStorage.getItem(CACHE_KEY);
        if (cachedRaw) {
          const cached: CachedStats = JSON.parse(cachedRaw);
          if (cached?.data) {
            applyStats(cached.data);
            if (Date.now() - cached.fetchedAt < CACHE_TTL) {
              setIsLoading(false);
              return;
            }
          }
        }

        const response = await fetch(`https://api.github.com/repos/${REPO}`, {
          headers: {
            Accept: "application/vnd.github+json"
          }
        });

        if (!response.ok) throw new Error(`GitHub API error: ${response.status}`);

        const data = await response.json();
        const repoData: RepoStats = { stars: data?.stargazers_count ?? 0 };

        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify({ fetchedAt: Date.now(), data: repoData })
        );

        applyStats(repoData);
      } catch (error) {
        console.error("Failed to fetch repo stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stars, isLoading };
};
