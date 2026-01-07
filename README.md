# Ortu Landing Page

The official landing page for **Ortu** - a cross-platform, minimal, and keyboard-centric clipboard manager.

## 🚀 About Ortu

Ortu is a modern clipboard manager built with **Rust** and **Tauri**, designed for developers who value performance, privacy, and keyboard efficiency. It works natively on macOS, Windows, and Linux.

- **Cross-Platform**: Seamless experience on all major OSs.
- **Zero Telemetry**: 100% local storage. Your clipboard data never leaves your device.
- **Keyboard First**: Navigate, search, and paste without touching your mouse (`⌥+V` / `Alt+V`).
- **Open Source**: Built in public, MIT licensed.

## ✨ Landing Page Features

This repository contains the source code for the landing page (`https://ortu.in`), featuring:

- **Bento Grid Layout**: A modern, modular way to showcase features.
- **Dynamic Download Button**: Automatically detects the user's OS and fetches the correct installer (`.dmg`, `.msi`, `.AppImage`) from GitHub Releases.
- **Live Download Count**: Fetches real-time download stats from the GitHub API.
  - _Hidden by default_: Append `?stats=true` to the URL to view (e.g., `https://ortu.in/?stats=true`).
- **Bold Typography**: "Type as Image" hero section with minimal aesthetics.
- **Responsive Design**: Fully optimized for mobile, tablet, and desktop.
- **Dark Mode**: A premium, developer-focused dark theme.

## 🛠️ Tech Stack

- **Framework**: [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)

## 🏃‍♂️ Getting Started

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/abhijith-p-subash/ortu-landing-page.git
    cd ortu-landing-page
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Run the development server:**

    ```bash
    npm run dev
    ```

4.  **Build for production:**
    ```bash
    npm run build
    ```

## 🤝 Contributing

Contributions are welcome! If you find a bug or want to improve the site, feel free to open an issue or submit a pull request.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

Built with ❤️ by [Abhijith P Subash](https://github.com/abhijith-p-subash).
Support the project: [Buy Me a Coffee](https://buymeacoffee.com/abhijithpsubash)
