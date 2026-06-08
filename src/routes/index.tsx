import { createFileRoute } from "@tanstack/react-router";
import { CarbonApp } from "@/components/CarbonApp";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Verdant — Understand your carbon footprint" },
      { name: "description", content: "A simple, personal carbon footprint calculator with tailored insights to help you live lighter on the planet." },
      { property: "og:title", content: "Verdant — Understand your carbon footprint" },
      { property: "og:description", content: "Track, understand, and reduce your everyday carbon footprint with simple, personalized insights." },
    ],
  }),
  component: Index,
});

function Index() {
  return <CarbonApp />;
}
