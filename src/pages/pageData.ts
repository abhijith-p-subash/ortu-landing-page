/**
 * Content for the platform landing pages.
 *
 * These exist so each search intent — "clipboard manager for mac", "…for
 * windows", "…for linux" — has a page whose whole purpose matches the query.
 * That only works if the pages are genuinely different from each other and from
 * the homepage; near-duplicates read as doorway pages and do more harm than
 * good. So everything here is platform-specific: real install flows, real
 * modifier keys, real gotchas, real questions.
 *
 * Facts are taken from the app's own docs (docs/SHORTCUTS.md, docs/FAQ.md,
 * docs/CODE_SIGNING_POLICY.md) — keep them in step when those change.
 */

export interface Faq {
  q: string;
  a: string;
}

export interface Step {
  title: string;
  body: string;
  code?: string;
}

export interface PlatformContent {
  slug: string;
  os: 'macOS' | 'Windows' | 'Linux';
  /** Used in the H1 and title. */
  headline: string;
  intro: string;
  /** Short label for the download button. */
  downloadLabel: string;
  installTitle: string;
  installSteps: Step[];
  shortcuts: { action: string; keys: string }[];
  notesTitle: string;
  notes: string[];
  faqs: Faq[];
}

const SHARED_STACK_NOTE =
  'Copy-to-stack sends the OS copy command to whatever app is focused, then queues the result. Paste-next pastes the queue back one item at a time, in order.';

export const platforms: PlatformContent[] = [
  {
    slug: 'clipboard-manager-for-mac',
    os: 'macOS',
    headline: 'A free, open-source clipboard manager for macOS',
    intro:
      'Ortu keeps every clip you copy on your Mac — text, images and files — in a local, searchable history you can call up over any app with a hotkey. It is MIT licensed, stores everything in a local SQLite database, and sends nothing anywhere: no account, no sync, no telemetry. Built with Rust and Tauri, so it is a small native binary rather than a bundled browser.',
    downloadLabel: 'Download for macOS',
    installTitle: 'Installing on macOS',
    installSteps: [
      {
        title: 'Download the .dmg',
        body: 'Grab the latest release and open the disk image, then drag Ortu into Applications as usual.',
      },
      {
        title: 'If Gatekeeper blocks it',
        body: 'Ortu is not yet notarized with an Apple Developer certificate, so macOS may refuse to open it the first time. Clearing the quarantine flag lets it launch. You only need to do this once.',
        code: 'xattr -dr com.apple.quarantine /Applications/Ortu.app',
      },
      {
        title: 'Grant Accessibility permission',
        body: 'To paste straight into the app you were last using, Ortu needs Accessibility access. Open System Settings → Privacy & Security → Accessibility and enable Ortu. Without it, clips still copy to the clipboard — you just paste them yourself.',
      },
    ],
    shortcuts: [
      { action: 'Open the quick popup', keys: '⌥V' },
      { action: 'Copy selection into the paste stack', keys: '⌘⇧C' },
      { action: 'Paste next item from the stack', keys: '⌥⇧V' },
      { action: 'Quick copy by position', keys: '⌘1 – ⌘9' },
      { action: 'Pin / unpin a clip', keys: '⌘P' },
      { action: 'Dismiss', keys: 'Esc' },
    ],
    notesTitle: 'Good to know on macOS',
    notes: [
      'Ortu runs as a menu-bar app rather than a Dock app, so it stays out of your way.',
      'All three global hotkeys are rebindable in Settings → Global Shortcuts if ⌥V clashes with something.',
      SHARED_STACK_NOTE,
      'Clipboard history lives in a local SQLite database on your Mac. Nothing is uploaded, and the only network request Ortu makes is an update check against GitHub.',
    ],
    faqs: [
      {
        q: 'Why does macOS say Ortu "cannot be opened because the developer cannot be verified"?',
        a: 'Because the build is not yet signed with a paid Apple Developer certificate. The source is public, so you can read or build it yourself. To open the downloaded app, clear the quarantine attribute with: xattr -dr com.apple.quarantine /Applications/Ortu.app',
      },
      {
        q: 'Does Ortu work on Apple Silicon and Intel Macs?',
        a: 'Yes. Releases ship a universal macOS build, so the same download runs natively on both Apple Silicon and Intel Macs.',
      },
      {
        q: 'Why does Ortu ask for Accessibility permission?',
        a: 'Only so it can paste directly into the app you were using before the popup appeared. macOS treats sending keystrokes to another application as an Accessibility action. If you decline, Ortu still works — clips are placed on the clipboard and you paste them yourself.',
      },
      {
        q: 'Is Ortu a free alternative to paid Mac clipboard managers?',
        a: 'Yes. Ortu is MIT licensed and free of charge, with no paid tier, subscription or account. You can inspect every line of the source on GitHub.',
      },
    ],
  },
  {
    slug: 'clipboard-manager-for-windows',
    os: 'Windows',
    headline: 'A free, open-source clipboard manager for Windows',
    intro:
      'Ortu gives Windows a clipboard history worth using: every copy — text, images and files — kept locally, searchable instantly, and one hotkey away over any app. It is MIT licensed and local-first, with no account, no cloud and no telemetry. Built with Rust and Tauri, so it installs small and stays light on memory.',
    downloadLabel: 'Download for Windows',
    installTitle: 'Installing on Windows',
    installSteps: [
      {
        title: 'Download the installer',
        body: 'Take the .exe (NSIS) installer from the latest release — or the .msi if you deploy that way — and run it.',
      },
      {
        title: 'If SmartScreen warns you',
        body: 'Windows shows "Windows protected your PC" for installers that are not yet code-signed. Click More info, then Run anyway. Ortu is open source, so you can review exactly what you are installing before you do.',
      },
      {
        title: 'Start using it',
        body: 'Ortu lives in the system tray and starts with Windows. Press Alt+V anywhere to bring up the quick popup.',
      },
    ],
    shortcuts: [
      { action: 'Open the quick popup', keys: 'Alt + V' },
      { action: 'Copy selection into the paste stack', keys: 'Ctrl + Shift + C' },
      { action: 'Paste next item from the stack', keys: 'Alt + Shift + V' },
      { action: 'Quick copy by position', keys: 'Ctrl + 1 – 9' },
      { action: 'Pin / unpin a clip', keys: 'Ctrl + P' },
      { action: 'Dismiss', keys: 'Esc' },
    ],
    notesTitle: 'Good to know on Windows',
    notes: [
      'Ortu goes further than the built-in Win+V history: it keeps images and file references, groups clips automatically, searches full-text, and encrypts anything that looks like a secret.',
      'All three global hotkeys are rebindable in Settings → Global Shortcuts, including combinations that use the Windows key.',
      SHARED_STACK_NOTE,
      'History is stored in a local SQLite database on your PC. The only network request Ortu makes is an update check against GitHub.',
    ],
    faqs: [
      {
        q: 'Windows SmartScreen is blocking the Ortu installer. Is it safe?',
        a: 'The warning appears because the installer is not yet code-signed, not because anything is wrong with it. Click More info, then Run anyway. Ortu is open source and built in public CI, so you can review the source and the build workflow before installing.',
      },
      {
        q: 'How is Ortu different from the built-in Windows clipboard history (Win+V)?',
        a: 'Win+V keeps a short, text-oriented list. Ortu keeps a durable local history of text, images and file references, adds full-text search, automatic grouping, pinning, a paste stack for pasting several items in sequence, encryption at rest for detected secrets, and rebindable hotkeys.',
      },
      {
        q: 'Does Ortu send my clipboard to the cloud?',
        a: 'No. Ortu is local-first. Clipboard history stays in a local database on your machine, there is no account or sync, and there is no telemetry.',
      },
      {
        q: 'Is Ortu really free?',
        a: 'Yes — MIT licensed and free of charge, with no paid tier and no subscription.',
      },
    ],
  },
  {
    slug: 'clipboard-manager-for-linux',
    os: 'Linux',
    headline: 'A free, open-source clipboard manager for Linux',
    intro:
      'Ortu brings a fast, searchable clipboard history to Linux desktops, with AppImage, .deb and .rpm builds. Text, images and file references are kept in a local SQLite database on your own machine — MIT licensed, no account, no cloud, no telemetry. Built with Rust and Tauri, so it is a single small native binary rather than a bundled browser.',
    downloadLabel: 'Download for Linux',
    installTitle: 'Installing on Linux',
    installSteps: [
      {
        title: 'Pick your package',
        body: 'Releases include an .AppImage that runs anywhere, plus .deb and .rpm packages for Debian/Ubuntu and Fedora/RHEL families.',
      },
      {
        title: 'AppImage',
        body: 'Make it executable and run it — no installation required.',
        code: 'chmod +x Ortu_*.AppImage\n./Ortu_*.AppImage',
      },
      {
        title: '.deb or .rpm',
        body: 'Install with your usual package manager.',
        code: 'sudo apt install ./Ortu_*_amd64.deb\n# or\nsudo dnf install ./Ortu-*.x86_64.rpm',
      },
    ],
    shortcuts: [
      { action: 'Open the quick popup', keys: 'Alt + V' },
      { action: 'Copy selection into the paste stack', keys: 'Ctrl + Shift + C' },
      { action: 'Paste next item from the stack', keys: 'Alt + Shift + V' },
      { action: 'Quick copy by position', keys: 'Ctrl + 1 – 9' },
      { action: 'Pin / unpin a clip', keys: 'Ctrl + P' },
      { action: 'Dismiss', keys: 'Esc' },
    ],
    notesTitle: 'Good to know on Linux',
    notes: [
      'Ortu runs on both X11 and Wayland. On Wayland some window placement is handled by the compositor rather than the app, so the quick popup follows the compositor\'s rules.',
      'A tray icon needs an AppIndicator implementation. On GNOME that usually means the AppIndicator extension; most other desktops ship one already.',
      SHARED_STACK_NOTE,
      'History is stored in a local SQLite database under your home directory. The only network request Ortu makes is an update check against GitHub.',
    ],
    faqs: [
      {
        q: 'Which Linux packages does Ortu ship?',
        a: 'An .AppImage that runs on most distributions without installing, plus .deb packages for Debian and Ubuntu and .rpm packages for Fedora and RHEL-family systems.',
      },
      {
        q: 'Does Ortu work on Wayland?',
        a: 'Yes. Ortu runs under both X11 and Wayland. Wayland deliberately restricts what applications can know about window and pointer position, so a few placement behaviours are left to the compositor.',
      },
      {
        q: 'I do not see a tray icon. What is wrong?',
        a: 'The tray needs an AppIndicator implementation on your desktop. GNOME users generally need the AppIndicator extension enabled; KDE, XFCE, Cinnamon and most others provide it out of the box. Ortu still works without a tray — the global hotkey opens the popup.',
      },
      {
        q: 'Is Ortu open source?',
        a: 'Yes, MIT licensed. The full source and the CI workflow that builds every release are public on GitHub.',
      },
    ],
  },
];

export const openSourceFaqs: Faq[] = [
  {
    q: 'Is Ortu really free and open source?',
    a: 'Yes. Ortu is released under the MIT licence and costs nothing. There is no paid tier, no subscription, no account, and no "pro" version withheld behind a paywall.',
  },
  {
    q: 'What does the MIT licence let me do?',
    a: 'Use Ortu for anything including commercial work, read and modify the source, and redistribute it — as long as the copyright notice and licence text travel with it. There is no warranty.',
  },
  {
    q: 'How do I know it is not sending my clipboard somewhere?',
    a: 'You can read the source. Clipboard capture, storage and the database schema are all in the public repository, and the only outbound request in the codebase is an update check against the GitHub releases API. There is no analytics or telemetry dependency to audit around.',
  },
  {
    q: 'Can I build Ortu myself instead of downloading a binary?',
    a: 'Yes. The repository documents the full development setup, and release builds are produced by a public GitHub Actions workflow, so you can compare what is published against how it is built.',
  },
];
