import { useMemo, useState } from "react";
import { Leaf, Car, Plane, Zap, UtensilsCrossed, Trash2, ArrowRight, RotateCcw, Sparkles, Wallet, Clock, TrendingUp, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

type Diet = "vegan" | "vegetarian" | "omnivore" | "heavy-meat";

interface Inputs {
  carKm: number;       // per week
  flightsShort: number; // per year
  flightsLong: number;  // per year
  electricityKwh: number; // per month
  diet: Diet;
  wasteKg: number;     // per week
}

const DEFAULTS: Inputs = {
  carKm: 80,
  flightsShort: 1,
  flightsLong: 0,
  electricityKwh: 250,
  diet: "omnivore",
  wasteKg: 8,
};

const DIET_FACTOR: Record<Diet, number> = {
  vegan: 1.5,
  vegetarian: 1.9,
  omnivore: 2.5,
  "heavy-meat": 3.3,
};

// Returns tonnes CO2e per year, plus per-category breakdown
function calculate(i: Inputs) {
  const transport = (i.carKm * 52 * 0.17) / 1000; // kg/km -> t
  const flights = (i.flightsShort * 250 + i.flightsLong * 1600) / 1000;
  const energy = (i.electricityKwh * 12 * 0.4) / 1000;
  const food = DIET_FACTOR[i.diet];
  const waste = (i.wasteKg * 52 * 0.5) / 1000;
  const total = transport + flights + energy + food + waste;
  return { transport, flights, energy, food, waste, total };
}

const GLOBAL_AVG = 4.7;
const PARIS_TARGET = 2.0;

export function CarbonApp() {
  const [inputs, setInputs] = useState<Inputs>(DEFAULTS);
  const [submitted, setSubmitted] = useState(false);
  const result = useMemo(() => calculate(inputs), [inputs]);

  const set = <K extends keyof Inputs>(k: K, v: Inputs[K]) =>
    setInputs((s) => ({ ...s, [k]: v }));

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
        <Hero />
        <section id="calculator" className="mt-16 grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <Card className="border-border/60 bg-card p-5 shadow-[0_12px_30px_-18px_rgba(15,23,42,0.35)] sm:p-8">
            <h2 className="font-serif text-2xl sm:text-3xl">Your week, your year</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Adjust the sliders to reflect your everyday life. Estimates update live.
            </p>

            <div className="mt-6 space-y-6 sm:space-y-8">
              <SliderField
                icon={<Car className="h-4 w-4" />}
                label="Driving"
                value={inputs.carKm}
                unit="km / week"
                min={0}
                max={1000}
                step={10}
                onChange={(v) => set("carKm", v)}
              />
              <SliderField
                icon={<Plane className="h-4 w-4" />}
                label="Short flights"
                hint="Under 3 hours"
                value={inputs.flightsShort}
                unit="per year"
                min={0}
                max={20}
                step={1}
                onChange={(v) => set("flightsShort", v)}
              />
              <SliderField
                icon={<Plane className="h-4 w-4" />}
                label="Long flights"
                hint="Intercontinental"
                value={inputs.flightsLong}
                unit="per year"
                min={0}
                max={10}
                step={1}
                onChange={(v) => set("flightsLong", v)}
              />
              <SliderField
                icon={<Zap className="h-4 w-4" />}
                label="Home electricity"
                value={inputs.electricityKwh}
                unit="kWh / month"
                min={0}
                max={1500}
                step={10}
                onChange={(v) => set("electricityKwh", v)}
              />
              <SliderField
                icon={<Trash2 className="h-4 w-4" />}
                label="Household waste"
                value={inputs.wasteKg}
                unit="kg / week"
                min={0}
                max={40}
                step={1}
                onChange={(v) => set("wasteKg", v)}
              />

              <div>
                <div className="flex items-center gap-2 text-sm font-medium">
                  <UtensilsCrossed className="h-4 w-4 text-primary" />
                  Diet
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {(["vegan", "vegetarian", "omnivore", "heavy-meat"] as Diet[]).map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => set("diet", d)}
                      aria-pressed={inputs.diet === d}
                      aria-label={`Select ${d.replace("-", " ")} diet option`}
                      className={`rounded-md border px-3 py-2 text-xs capitalize transition ${
                        inputs.diet === d
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-background hover:border-primary/40 hover:bg-muted"
                      }`}
                    >
                      {d.replace("-", " ")}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button onClick={() => setSubmitted(true)} className="gap-2" aria-label="Show personalized carbon insights">
                See my insights <ArrowRight className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  setInputs(DEFAULTS);
                  setSubmitted(false);
                }}
                className="gap-2"
                aria-label="Reset calculator inputs"
              >
                <RotateCcw className="h-4 w-4" /> Reset
              </Button>
            </div>
          </Card>

          <div className="space-y-6">
            <ResultCard total={result.total} />
            <BreakdownCard result={result} />
            {submitted && <Insights inputs={inputs} result={result} />}
          </div>
        </section>

        <About />
      </main>
      <Footer />
    </div>
  );
}

function Header() {
  return (
    <header className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-6">
      <div className="flex items-center gap-2">
        <div className="grid h-8 w-8 place-items-center rounded-full bg-primary text-primary-foreground">
          <Leaf className="h-4 w-4" />
        </div>
        <span className="font-serif text-xl">Verdant</span>
      </div>
      <nav className="hidden gap-6 text-sm text-muted-foreground sm:flex">
        <a href="#calculator" className="hover:text-foreground">Calculator</a>
        <a href="#about" className="hover:text-foreground">Why it matters</a>
      </nav>
    </header>
  );
}

function Hero() {
  return (
    <section className="pt-12 sm:pt-20">
      <p className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground shadow-sm">
        <Sparkles className="h-3 w-3 text-primary" /> Personal carbon insights
      </p>
      <h1 className="mt-6 max-w-3xl font-serif text-4xl leading-[1.05] sm:text-5xl lg:text-6xl">
        Understand the weight <br className="hidden sm:block" />
        of your everyday life.
      </h1>
      <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
        Verdant turns the things you already do — how you move, eat, and power your home —
        into a clear picture of your carbon footprint, with small actions that actually move the needle.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <a href="#calculator">
          <Button className="gap-2">Start the calculator <ArrowRight className="h-4 w-4" /></Button>
        </a>
        <Button variant="outline" className="gap-2" onClick={() => document.querySelector("#about")?.scrollIntoView({ behavior: "smooth" })}>
          See why it matters
        </Button>
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {[
          { label: "Live updates", value: "Instant", note: "Adjust sliders and see changes right away." },
          { label: "Actionable tips", value: "Smart", note: "Get practical ways to reduce your footprint." },
          { label: "Responsive", value: "Any device", note: "Works cleanly on mobile, tablet, and desktop." },
        ].map((item) => (
          <div key={item.label} className="rounded-2xl border border-border/60 bg-card/80 p-4 shadow-sm">
            <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{item.label}</p>
            <p className="mt-1 font-serif text-2xl text-foreground">{item.value}</p>
            <p className="mt-1 text-sm text-muted-foreground">{item.note}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function SliderField({
  icon, label, hint, value, unit, min, max, step, onChange,
}: {
  icon: React.ReactNode;
  label: string;
  hint?: string;
  value: number;
  unit: string;
  min: number; max: number; step: number;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <Label className="flex items-center gap-2 text-sm font-medium">
          <span className="text-primary">{icon}</span>
          {label}
          {hint && <span className="text-xs font-normal text-muted-foreground">· {hint}</span>}
        </Label>
        <span className="text-sm tabular-nums text-muted-foreground">
          <span className="text-foreground">{value}</span> {unit}
        </span>
      </div>
      <Slider
        className="mt-3"
        value={[value]}
        min={min}
        max={max}
        step={step}
        onValueChange={(v) => onChange(v[0])}
      />
    </div>
  );
}

function ResultCard({ total }: { total: number }) {
  const pctOfAvg = Math.round((total / GLOBAL_AVG) * 100);
  const vsTarget = total - PARIS_TARGET;
  const status =
    total <= PARIS_TARGET ? "On track with 1.5°C target" :
    total <= GLOBAL_AVG ? "Below the global average" :
    "Above the global average";

  return (
    <Card aria-live="polite" className="border-border/60 bg-card p-6 shadow-[0_12px_30px_-18px_rgba(15,23,42,0.35)] sm:p-8 lg:sticky lg:top-6">
      <p className="text-xs uppercase tracking-wider text-muted-foreground">Your estimate</p>
      <div className="mt-3 flex items-baseline gap-2">
        <span className="font-serif text-6xl">{total.toFixed(1)}</span>
        <span className="text-sm text-muted-foreground">tCO₂e / year</span>
      </div>
      <p className="mt-2 text-sm text-foreground/80">{status}</p>

      <div className="mt-6 space-y-3">
        <Bar label="vs. global average" value={pctOfAvg} note={`${pctOfAvg}%`} />
        <p className="text-xs text-muted-foreground">
          {vsTarget > 0
            ? `${vsTarget.toFixed(1)} t above the Paris-aligned 2.0 t target.`
            : `${Math.abs(vsTarget).toFixed(1)} t below the Paris-aligned target — well done.`}
        </p>
      </div>
    </Card>
  );
}

function Bar({ label, value, note }: { label: string; value: number; note: string }) {
  const width = Math.min(100, value);
  return (
    <div>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{label}</span>
        <span className="tabular-nums">{note}</span>
      </div>
      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-all duration-500"
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
}

function BreakdownCard({ result }: { result: ReturnType<typeof calculate> }) {
  const rows = [
    { key: "Transport", v: result.transport, icon: <Car className="h-3.5 w-3.5" /> },
    { key: "Flights", v: result.flights, icon: <Plane className="h-3.5 w-3.5" /> },
    { key: "Energy", v: result.energy, icon: <Zap className="h-3.5 w-3.5" /> },
    { key: "Food", v: result.food, icon: <UtensilsCrossed className="h-3.5 w-3.5" /> },
    { key: "Waste", v: result.waste, icon: <Trash2 className="h-3.5 w-3.5" /> },
  ];
  const max = Math.max(...rows.map((r) => r.v), 0.1);
  return (
    <Card className="border-border/60 bg-card p-6 shadow-[0_12px_30px_-18px_rgba(15,23,42,0.35)] sm:p-8">
      <p className="text-xs uppercase tracking-wider text-muted-foreground">Breakdown</p>
      <ul className="mt-4 space-y-3">
        {rows.map((r) => (
          <li key={r.key}>
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 text-foreground/90">
                <span className="text-primary">{r.icon}</span>
                {r.key}
              </span>
              <span className="tabular-nums text-muted-foreground">{r.v.toFixed(2)} t</span>
            </div>
            <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-accent"
                style={{ width: `${(r.v / max) * 100}%` }}
              />
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}

function Insights({ inputs, result }: { inputs: Inputs; result: ReturnType<typeof calculate> }) {
  const tips = buildTips(inputs);
  const potential = tips.reduce((s, t) => s + t.saves, 0);
  const netCostYear = tips.reduce((s, t) => s + t.upfrontCost + t.annualCost - t.annualSavings, 0);
  const annualSavings = tips.reduce((s, t) => s + t.annualSavings, 0);
  const upfront = tips.reduce((s, t) => s + t.upfrontCost, 0);

  return (
    <Card className="border-primary/30 bg-secondary/40 p-6 shadow-[0_12px_30px_-18px_rgba(15,23,42,0.35)] sm:p-8">
      <p className="text-xs uppercase tracking-wider text-primary">Personalized insights</p>
      <h3 className="mt-2 font-serif text-2xl">
        You could save about {potential.toFixed(1)} t / year
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        That's roughly {Math.round((potential / Math.max(result.total, 0.1)) * 100)}% of your current footprint.
      </p>

      {tips.some((t) => t.saves > 0) && (
        <div className="mt-5 grid grid-cols-1 gap-3 rounded-xl border border-border/60 bg-background/60 p-4 text-center sm:grid-cols-3">
          <SummaryStat
            icon={<Wallet className="h-3.5 w-3.5" />}
            label="Upfront"
            value={formatMoney(upfront)}
          />
          <SummaryStat
            icon={<TrendingDown className="h-3.5 w-3.5" />}
            label="Saves / yr"
            value={formatMoney(annualSavings)}
            positive
          />
          <SummaryStat
            icon={netCostYear <= 0 ? <TrendingDown className="h-3.5 w-3.5" /> : <TrendingUp className="h-3.5 w-3.5" />}
            label="Net yr 1"
            value={`${netCostYear <= 0 ? "−" : "+"}${formatMoney(Math.abs(netCostYear))}`}
            positive={netCostYear <= 0}
          />
        </div>
      )}

      <ul className="mt-5 space-y-4">
        {tips.map((t) => (
          <li key={t.title} className="rounded-lg border border-border/60 bg-background/60 p-4">
            <div className="flex items-start gap-3">
              <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{t.title}</p>
                <p className="mt-0.5 text-sm text-muted-foreground">{t.body}</p>
              </div>
            </div>
            {t.saves > 0 && (
              <div className="mt-3 grid grid-cols-1 gap-2 border-t border-border/60 pt-3 text-xs sm:grid-cols-3">
                <Metric
                  icon={<Leaf className="h-3 w-3" />}
                  label="CO₂e / yr"
                  value={`${t.saves.toFixed(2)} t`}
                  tone="primary"
                />
                <Metric
                  icon={<Wallet className="h-3 w-3" />}
                  label={t.annualSavings >= t.annualCost + t.upfrontCost / 5 ? "Saves / yr" : "Cost / yr"}
                  value={
                    t.annualSavings > 0
                      ? `−${formatMoney(t.annualSavings)}`
                      : t.upfrontCost + t.annualCost > 0
                        ? `+${formatMoney(t.upfrontCost + t.annualCost)}`
                        : "Free"
                  }
                  tone={t.annualSavings > t.annualCost ? "positive" : t.upfrontCost + t.annualCost > 0 ? "neutral" : "primary"}
                />
                <Metric
                  icon={<Clock className="h-3 w-3" />}
                  label="Time to impact"
                  value={t.timeToImpact}
                  tone="neutral"
                />
              </div>
            )}
          </li>
        ))}
      </ul>
      <p className="mt-4 text-[11px] leading-relaxed text-muted-foreground">
        Cost and savings are rough order-of-magnitude estimates in INR based on typical
        household figures. Your local prices may differ.
      </p>
    </Card>
  );
}

type Tip = {
  title: string;
  body: string;
  saves: number;          // t CO2e / year
  upfrontCost: number;    // INR one-time
  annualCost: number;     // INR ongoing
  annualSavings: number;  // INR saved per year
  timeToImpact: string;   // human-readable
};

function buildTips(inputs: Inputs): Tip[] {
  const tips: Tip[] = [];

  if (inputs.carKm > 100) {
    const shiftedKm = inputs.carKm * 0.3 * 52;
    tips.push({
      title: "Swap 30% of car trips for walking, biking, or transit",
      body: "Short urban trips are the easiest wins — most drives under 3 km can become a bike ride.",
      saves: (shiftedKm * 0.17) / 1000,
      upfrontCost: 400,             // a decent commuter bike + lock
      annualCost: 0,
      annualSavings: shiftedKm * 0.18, // fuel + wear, ~$0.18/km
      timeToImpact: "Immediate",
    });
  }
  if (inputs.flightsLong > 0) {
    tips.push({
      title: "Replace one long flight with a closer destination",
      body: "A single intercontinental flight can outweigh a full year of careful choices.",
      saves: 1.6,
      upfrontCost: 0,
      annualCost: 0,
      annualSavings: 900,
      timeToImpact: "Next trip",
    });
  }
  if (inputs.electricityKwh > 200) {
    tips.push({
      title: "Switch to a renewable electricity plan",
      body: "Green tariffs cut your home energy footprint by up to 80% with zero lifestyle change.",
      saves: (inputs.electricityKwh * 12 * 0.32) / 1000,
      upfrontCost: 0,
      annualCost: Math.round(inputs.electricityKwh * 12 * 0.015), // small premium
      annualSavings: 0,
      timeToImpact: "1 billing cycle",
    });
  }
  if (inputs.electricityKwh > 400) {
    tips.push({
      title: "Install a rooftop solar system",
      body: "Pays back over time and slashes grid emissions for the life of the panels.",
      saves: (inputs.electricityKwh * 12 * 0.6) / 1000,
      upfrontCost: 14000,
      annualCost: 100,
      annualSavings: Math.round(inputs.electricityKwh * 12 * 0.18),
      timeToImpact: "2–3 months install",
    });
  }
  if (inputs.diet === "heavy-meat" || inputs.diet === "omnivore") {
    tips.push({
      title: "Try two plant-based dinners a week",
      body: "Small shifts in diet have an outsized effect — beef in particular is carbon-dense.",
      saves: 0.4,
      upfrontCost: 0,
      annualCost: 0,
      annualSavings: 260, // plant proteins typically cheaper than meat
      timeToImpact: "This week",
    });
  }
  if (inputs.wasteKg > 5) {
    tips.push({
      title: "Compost food scraps",
      body: "Up to a third of household waste is organic — composting avoids landfill methane.",
      saves: (inputs.wasteKg * 0.3 * 52 * 0.5) / 1000,
      upfrontCost: 60, // countertop bin or starter tumbler
      annualCost: 0,
      annualSavings: 40, // reduced garbage + free soil
      timeToImpact: "2–4 weeks",
    });
  }
  if (!tips.length) {
    tips.push({
      title: "You're already light on the planet",
      body: "Keep going — share what works with someone whose footprint is bigger than yours.",
      saves: 0,
      upfrontCost: 0,
      annualCost: 0,
      annualSavings: 0,
      timeToImpact: "—",
    });
  }
  return tips;
}

function formatMoney(n: number) {
  const v = Math.round(n);
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(v);
}

function SummaryStat({
  icon, label, value, positive,
}: { icon: React.ReactNode; label: string; value: string; positive?: boolean }) {
  return (
    <div>
      <div className="flex items-center justify-center gap-1 text-[10px] uppercase tracking-wider text-muted-foreground">
        {icon} {label}
      </div>
      <p className={`mt-1 font-serif text-xl tabular-nums ${positive ? "text-primary" : "text-foreground"}`}>
        {value}
      </p>
    </div>
  );
}

function Metric({
  icon, label, value, tone,
}: { icon: React.ReactNode; label: string; value: string; tone: "primary" | "positive" | "neutral" }) {
  const toneClass =
    tone === "primary" ? "text-primary" :
    tone === "positive" ? "text-primary" :
    "text-foreground";
  return (
    <div className="rounded-md bg-muted/60 px-2 py-1.5">
      <div className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-muted-foreground">
        {icon} {label}
      </div>
      <p className={`mt-0.5 text-sm font-medium tabular-nums ${toneClass}`}>{value}</p>
    </div>
  );
}

function About() {
  return (
    <section id="about" className="mt-24 grid gap-10 border-t border-border pt-16 sm:grid-cols-3">
      <div>
        <p className="text-xs uppercase tracking-wider text-primary">Why it matters</p>
        <h2 className="mt-2 font-serif text-3xl">Small actions, compounded.</h2>
      </div>
      <div className="sm:col-span-2 grid gap-6 md:grid-cols-2">
        <Stat label="Global average" value="4.7 t" sub="CO₂e per person, per year" />
        <Stat label="Paris-aligned target" value="2.0 t" sub="To stay within 1.5°C by 2050" />
        <Stat label="Biggest lever" value="Flights" sub="One long flight ≈ a year of careful choices" />
        <Stat label="Easiest win" value="Energy" sub="A green tariff can cut home emissions ~80%" />
      </div>
    </section>
  );
}

function Stat({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-1 font-serif text-3xl">{value}</p>
      <p className="mt-1 text-sm text-muted-foreground">{sub}</p>
    </div>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-5xl flex-col gap-2 px-6 py-8 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} Verdant. Estimates are illustrative.</p>
        <p>Built with care for the planet.</p>
      </div>
    </footer>
  );
}