import { useLatestRelease } from "./useLatestRelease";

/**
 * Wraps useLatestRelease and exposes the click behaviour shared by every
 * download button (hero, navbar, …). The href always points at the real
 * OS-specific asset so the file downloads; on macOS we additionally surface
 * the Gatekeeper steps in the install section.
 */
export const useDownload = () => {
  const release = useLatestRelease();

  const onDownloadClick = () => {
    // The anchor's href triggers the actual download for every OS.
    // macOS users also need the Gatekeeper steps, so reveal them.
    if (release.os !== "mac") return;
    sessionStorage.setItem("ortu_requires_mac_steps", "true");
    window.dispatchEvent(new Event("ortu:dmg-download"));
    document
      .getElementById("download")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return { ...release, onDownloadClick };
};
