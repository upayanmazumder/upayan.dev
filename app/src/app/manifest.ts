import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Upayan",
    short_name: "Upayan",
    description: "Upayan's portfolio site",
    start_url: "/",
    display: "fullscreen",
    background_color: "#000000",
    theme_color: "#000000",
    categories: ["portfolio", "developer", "technology"],
    icons: [
      { src: "/icons/icon-16x16.webp", sizes: "16x16", type: "image/webp" },
      { src: "/icons/icon-32x32.webp", sizes: "32x32", type: "image/webp" },
      { src: "/icons/icon-48x48.webp", sizes: "48x48", type: "image/webp" },
      { src: "/icons/icon-64x64.webp", sizes: "64x64", type: "image/webp" },
      { src: "/icons/icon-72x72.webp", sizes: "72x72", type: "image/webp" },
      { src: "/icons/icon-76x76.webp", sizes: "76x76", type: "image/webp" },
      { src: "/icons/icon-96x96.webp", sizes: "96x96", type: "image/webp" },
      { src: "/icons/icon-114x114.webp", sizes: "114x114", type: "image/webp" },
      { src: "/icons/icon-120x120.webp", sizes: "120x120", type: "image/webp" },
      { src: "/icons/icon-128x128.webp", sizes: "128x128", type: "image/webp" },
      { src: "/icons/icon-144x144.webp", sizes: "144x144", type: "image/webp" },
      { src: "/icons/icon-152x152.webp", sizes: "152x152", type: "image/webp" },
      { src: "/icons/icon-180x180.webp", sizes: "180x180", type: "image/webp" },
      { src: "/icons/icon-192x192.webp", sizes: "192x192", type: "image/webp" },
      { src: "/icons/icon-196x196.webp", sizes: "196x196", type: "image/webp" },
      { src: "/icons/icon-228x228.webp", sizes: "228x228", type: "image/webp" },
      { src: "/icons/icon-256x256.webp", sizes: "256x256", type: "image/webp" },
      { src: "/icons/icon-384x384.webp", sizes: "384x384", type: "image/webp" },
      { src: "/icons/icon-512x512.webp", sizes: "512x512", type: "image/webp" },
    ],
    shortcuts: [
      {
        name: "DevJourney",
        short_name: "DevJourney",
        description: "View my development journey",
        url: "/devjourney",
        icons: [
          { src: "/icons/icon-96x96.webp", sizes: "96x96", type: "image/webp" },
        ],
      },
      {
        name: "Certifications",
        short_name: "Certifications",
        description: "View My Certifications",
        url: "/certificates",
        icons: [
          { src: "/icons/icon-96x96.webp", sizes: "96x96", type: "image/webp" },
        ],
      },
      {
        name: "Projects",
        short_name: "Projects",
        description: "View My Projects",
        url: "/#projects",
        icons: [
          { src: "/icons/icon-96x96.webp", sizes: "96x96", type: "image/webp" },
        ],
      },
    ],
    screenshots: [
      {
        src: "/screenshots/screenshot-home-wide.avif",
        sizes: "2880x1556",
        type: "image/avif",
        form_factor: "wide",
      },
      {
        src: "/screenshots/screenshot-clubs-wide.avif",
        sizes: "2880x1556",
        type: "image/avif",
        form_factor: "wide",
      },
      {
        src: "/screenshots/screenshot-projects-wide.avif",
        sizes: "2880x1556",
        type: "image/avif",
        form_factor: "wide",
      },
      {
        src: "/screenshots/screenshot-certificates-wide.avif",
        sizes: "2880x1556",
        type: "image/avif",
        form_factor: "wide",
      },
      {
        src: "/screenshots/screenshot-devjourney-wide.avif",
        sizes: "2880x1556",
        type: "image/avif",
        form_factor: "wide",
      },
      {
        src: "/screenshots/screenshot-home.avif",
        sizes: "618x1372",
        type: "image/avif",
      },
      {
        src: "/screenshots/screenshot-clubs.avif",
        sizes: "618x1372",
        type: "image/avif",
      },
      {
        src: "/screenshots/screenshot-projects.avif",
        sizes: "618x1372",
        type: "image/avif",
      },
      {
        src: "/screenshots/screenshot-certificates.avif",
        sizes: "618x1372",
        type: "image/avif",
      },
      {
        src: "/screenshots/screenshot-devjourney.avif",
        sizes: "618x1372",
        type: "image/avif",
      },
    ],
    lang: "en-US",
    dir: "ltr",
  };
}
