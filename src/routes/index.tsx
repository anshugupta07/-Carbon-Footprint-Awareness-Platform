import { createFileRoute } from "@tanstack/react-router";
import { CarbonApp } from "@/components/CarbonApp";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Verdant — Understand your carbon footprint" },
      { name: "description", content: "A simple, personal carbon footprint calculator with tailored insights to help you live lighter on the planet." },
      { name: "keywords", content: "carbon footprint, sustainability, calculator, climate, eco tips" },
      { name: "theme-color", content: "#f5fbf4" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { property: "og:title", content: "Verdant — Understand your carbon footprint" },
      { property: "og:description", content: "Track, understand, and reduce your everyday carbon footprint with simple, personalized insights." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://verdant.example.com/" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Verdant — Understand your carbon footprint" },
      { name: "twitter:description", content: "A cleaner way to see how your choices affect your carbon footprint." },
    ],
    links: [
      { rel: "canonical", href: "https://verdant.example.com/" },
      { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
    ],
  }),
  component: Index,
});

function Index() {
  return <CarbonApp />;
}
