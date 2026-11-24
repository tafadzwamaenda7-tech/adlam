import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Truck, Package, Snowflake, MapPin, Clock, ShieldCheck, Phone, Mail, ArrowRight } from "lucide-react";
import hero from "@/assets/hero-truck.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Adlam Investment — Trucking & Logistics" },
      { name: "description", content: "Full truckload, LTL and refrigerated freight delivered on time, across the region." },
      { property: "og:title", content: "Adlam Investment — Trucking & Logistics" },
      { property: "og:description", content: "Full truckload, LTL and refrigerated freight delivered on time." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const services = [
  { icon: Truck, title: "Full Truckload", text: "Dedicated trucks for large shipments, door to door with no stops." },
  { icon: Package, title: "Part Loads (LTL)", text: "Share space and save. Ideal for pallets and smaller consignments." },
  { icon: Snowflake, title: "Refrigerated", text: "Temperature-controlled trailers for food, pharma and perishables." },
  { icon: MapPin, title: "Cross-Border", text: "Customs-ready transport across borders with full paperwork support." },
];

const stats = [
  ["120+", "Trucks in fleet"],
  ["98.7%", "On-time delivery"],
  ["15 yrs", "On the road"],
  ["24/7", "Live tracking"],
];

function Index() {
  const [sent, setSent] = useState(false);
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="absolute inset-x-0 top-0 z-20">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 text-secondary-foreground">
          <a href="#" className="flex items-center gap-2 font-display text-xl">
            <Truck className="h-7 w-7 text-primary" /> ADLAM INVESTMENT
          </a>
          <nav className="hidden gap-8 text-sm font-semibold uppercase tracking-wider md:flex">
            <a href="#services" className="hover:text-primary">Services</a>
            <a href="#why" className="hover:text-primary">Why us</a>
            <a href="#quote" className="hover:text-primary">Get a quote</a>
          </nav>
        </div>
      </header>

      <section className="relative flex min-h-[92vh] items-center overflow-hidden bg-secondary">
        <img src={hero} alt="Semi truck on a highway at sunset" width={1920} height={1088} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-hero-overlay" />
        <div className="relative mx-auto w-full max-w-7xl px-6 text-secondary-foreground">
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.3em] text-primary">Trucking & Logistics</p>
          <h1 className="max-w-3xl text-5xl uppercase leading-[0.95] md:text-7xl">Your freight.<br />On time.<br /><span className="text-primary">Every mile.</span></h1>
          <p className="mt-6 max-w-xl text-lg opacity-85">Reliable road transport for businesses that can't afford delays. Modern fleet, experienced drivers, live tracking.</p>
          <div className="mt-10 flex flex-wrap gap-4">
            <a href="#quote" className="inline-flex items-center gap-2 bg-primary px-7 py-4 font-bold uppercase tracking-wide text-primary-foreground transition hover:brightness-110">Get a free quote <ArrowRight className="h-5 w-5" /></a>
            <a href="#services" className="inline-flex items-center border-2 border-secondary-foreground/40 px-7 py-4 font-bold uppercase tracking-wide transition hover:border-primary hover:text-primary">Our services</a>
          </div>
        </div>
        <div className="stripe-road absolute inset-x-0 bottom-0" />
      </section>

      <section className="bg-secondary text-secondary-foreground">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-6 py-12 md:grid-cols-4">
          {stats.map(([n, l]) => (
            <div key={l}><div className="font-display text-4xl text-primary">{n}</div><div className="mt-1 text-sm uppercase tracking-wider opacity-70">{l}</div></div>
          ))}
        </div>
      </section>

      <section id="services" className="mx-auto max-w-7xl px-6 py-24">
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-primary">What we haul</p>
        <h2 className="mt-3 text-4xl uppercase md:text-5xl">Services built for business</h2>
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {services.map((s) => (
            <div key={s.title} className="group border border-border bg-card p-8 transition hover:-translate-y-1 hover:border-primary">
              <s.icon className="h-10 w-10 text-primary" />
              <h3 className="mt-6 text-xl uppercase">{s.title}</h3>
              <p className="mt-3 text-muted-foreground">{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="why" className="bg-muted">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-24 md:grid-cols-3">
          {[
            [Clock, "On schedule", "Planned routes and real-time dispatch keep deliveries on the clock."],
            [MapPin, "Live tracking", "Know exactly where your load is, any time of day."],
            [ShieldCheck, "Fully insured", "Every shipment covered, handled by licensed professional drivers."],
          ].map(([Icon, t, d]) => {
            const I = Icon as typeof Clock;
            return (
              <div key={t as string}>
                <div className="flex h-14 w-14 items-center justify-center bg-secondary"><I className="h-7 w-7 text-primary" /></div>
                <h3 className="mt-6 text-2xl uppercase">{t as string}</h3>
                <p className="mt-3 text-muted-foreground">{d as string}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section id="quote" className="mx-auto grid max-w-7xl gap-12 px-6 py-24 lg:grid-cols-2">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-primary">Get moving</p>
          <h2 className="mt-3 text-4xl uppercase md:text-5xl">Request a quote</h2>
          <p className="mt-4 max-w-md text-muted-foreground">Tell us what you're shipping and where. We'll reply with a price within one business day.</p>
          <div className="mt-10 space-y-4">
            <div className="flex items-center gap-3"><Phone className="h-5 w-5 text-primary" /> +00 000 000 000</div>
            <div className="flex items-center gap-3"><Mail className="h-5 w-5 text-primary" /> dispatch@example.com</div>
          </div>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="grid gap-4 border border-border bg-card p-8 sm:grid-cols-2">
          {sent ? (
            <div className="sm:col-span-2 py-12 text-center"><Truck className="mx-auto h-12 w-12 text-primary" /><h3 className="mt-4 text-2xl uppercase">Thanks!</h3><p className="mt-2 text-muted-foreground">We'll be in touch shortly.</p></div>
          ) : (
            <>
              {["Name", "Email", "Pickup city", "Delivery city"].map((f) => (
                <label key={f} className="text-sm font-semibold">{f}
                  <input required type={f === "Email" ? "email" : "text"} className="mt-2 w-full border border-input bg-background px-4 py-3 outline-none focus:border-primary" />
                </label>
              ))}
              <label className="text-sm font-semibold sm:col-span-2">Cargo details
                <textarea rows={4} className="mt-2 w-full border border-input bg-background px-4 py-3 outline-none focus:border-primary" />
              </label>
              <button className="bg-primary px-6 py-4 font-bold uppercase tracking-wide text-primary-foreground transition hover:brightness-110 sm:col-span-2">Send request</button>
            </>
          )}
        </form>
      </section>

      <footer className="bg-secondary text-secondary-foreground">
        <div className="stripe-road" />
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-8 text-sm opacity-80">
          <span className="flex items-center gap-2 font-display"><Truck className="h-5 w-5 text-primary" /> ADLAM INVESTMENT</span>
          <span>© 2026 Adlam Investment. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
}
