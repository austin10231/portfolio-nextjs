import type { NextConfig } from "next";

const config: NextConfig = {
  devIndicators: false,
  async redirects() {
    return [
      { source: "/index.html", destination: "/", permanent: true },
      { source: "/experience.html", destination: "/experience", permanent: true },
      { source: "/projects.html", destination: "/projects", permanent: true },
      { source: "/contact.html", destination: "/contact", permanent: true },
      { source: "/UI-design/ui.html", destination: "/ui-design", permanent: true },
    ];
  },
};
export default config;
