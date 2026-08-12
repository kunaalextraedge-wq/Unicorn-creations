import { useState, useEffect, useRef } from "react";

// ── CONTACT DETAILS — replace before going live ─────────────────────────────
const BRAND_NAME = "UNICORN CREATIONS";
const BRAND_TAGLINE = "Hotel Amenity Kits, Done Right";
const BRAND_WHATSAPP_NUMBER = "919011101654"; // Unicorn Creations WhatsApp
const BRAND_EMAIL = "bigfitnagpur@gmail.com"; // Unicorn Creations email
const BRAND_HANDLE = "@unicorncreations"; // TODO: replace with real Instagram handle if used

// ── Palette & tokens (Godmode system) ───────────────────────────────────────
const C = {
  bg:      "#080808",
  surface: "#0f0f0f",
  card:    "#131313",
  border:  "#1c1c1c",
  gold:    "#c9a84c",
  gold2:   "#e8c87a",
  goldDim: "rgba(201,168,76,0.12)",
  white:   "#f0ece4",
  dim:     "#7a7a7a",
  faint:   "#2a2a2a",
  green:   "#4a8c5c",
  greenDim:"rgba(74,140,92,0.12)",
};

// ── Category & product data ──────────────────────────────────────────────────
// Edit freely — this is the entire catalog. Real photos aren't included;
// icons stand in until product photography is available.
const CATEGORIES = [
  { id: "dental",   label: "Dental Kits",   icon: "tooth" },
  { id: "washroom", label: "Washroom Kits", icon: "droplet" },
  { id: "combo",    label: "Combo Kits",    icon: "gift" },
];

const PRODUCTS = [
  { id: "d1", category: "dental", tier: "Essential", name: "Essential Dental Kit",
    tagline: "Compact, individually wrapped",
    description: "Travel-size toothbrush and toothpaste, individually sealed for hygiene. Built for high-turnover rooms where cost-per-unit matters most.",
    moq: "500 units / case of 100" },
  { id: "d2", category: "dental", tier: "Eco", name: "Eco Bamboo Dental Kit",
    tagline: "Biodegradable, guest-facing sustainability story",
    description: "Bamboo-handle toothbrush with natural toothpaste, wrapped in compostable packaging. A visible sustainability signal for eco-conscious properties.",
    moq: "500 units / case of 100" },
  { id: "d3", category: "dental", tier: "Premium", name: "Premium Dental Kit",
    tagline: "Toothbrush, toothpaste, mouthwash, floss",
    description: "Full oral care set with mouthwash sachet and floss pick, in branded premium packaging. Built for 4–5 star positioning.",
    moq: "300 units / case of 50" },

  { id: "w1", category: "washroom", tier: "Essential", name: "Essential Washroom Kit",
    tagline: "Shampoo, soap, shower cap",
    description: "Core travel-size trio covering the basics guests expect in every room, at a price that works for volume properties.",
    moq: "500 units / case of 100" },
  { id: "w2", category: "washroom", tier: "Deluxe", name: "Deluxe Washroom Kit",
    tagline: "Full bath range + vanity kit",
    description: "Shampoo, conditioner, body wash, body lotion, soap, shower cap, and vanity kit — a complete mid-tier bathroom amenity set.",
    moq: "300 units / case of 50" },
  { id: "w3", category: "washroom", tier: "Spa", name: "Spa Washroom Kit",
    tagline: "Botanical range, boutique feel",
    description: "Premium botanical shampoo, conditioner, body wash, and lotion, plus cotton buds and an emery board. Designed for boutique and luxury stays.",
    moq: "200 units / case of 25" },

  { id: "c1", category: "combo", tier: "Welcome", name: "Welcome Guest Kit",
    tagline: "Dental + washroom essentials, bundled",
    description: "Combines the Essential Dental Kit and Essential Washroom Kit into one bundled SKU — simpler ordering and stocking for standard rooms.",
    moq: "500 units / case of 100" },
  { id: "c2", category: "combo", tier: "Business", name: "Business Traveler Kit",
    tagline: "Dental + washroom + shoe shine + sewing kit",
    description: "Everything in the Welcome Kit plus a shoe-shine sponge and mini sewing kit — aimed at business-focused properties.",
    moq: "300 units / case of 50" },
  { id: "c3", category: "combo", tier: "Luxury", name: "Luxury Suite Kit",
    tagline: "Premium dental + spa washroom + extras",
    description: "Premium Dental Kit and Spa Washroom Kit bundled with slippers and a fragrance sachet — built for suites and top-tier properties.",
    moq: "150 units / case of 25" },
];

// ── Icons (simple line SVGs — no stock photography used) ────────────────────
function CategoryIcon({ type, size = 22, color = C.gold }) {
  const common = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: color, strokeWidth: 1.4, strokeLinecap: "round", strokeLinejoin: "round" };
  if (type === "tooth") {
    return (
      <svg {...common}>
        <path d="M12 3c-2.2 0-3.6 1.1-4.4 1.1C6.4 4.1 5 3.5 4 4.3c-1.4 1.1-1.2 3.6-.8 5.4.5 2.2 1.3 4.6 2 6.4.5 1.3 1 2.9 2 2.9.9 0 1-1.6 1.2-2.8.2-1 .5-2 1.6-2s1.4 1 1.6 2c.2 1.2.3 2.8 1.2 2.8 1 0 1.5-1.6 2-2.9.7-1.8 1.5-4.2 2-6.4.4-1.8.6-4.3-.8-5.4-1-.8-2.4-.2-3.6-.2C15.6 4.1 14.2 3 12 3Z" />
      </svg>
    );
  }
  if (type === "droplet") {
    return (
      <svg {...common}>
        <path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11Z" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <rect x="4" y="9" width="16" height="11" rx="1" />
      <path d="M4 9h16M12 9v11M12 9c-1.5-3-4-4-5.5-2.5S6 9 12 9Zm0 0c1.5-3 4-4 5.5-2.5S18 9 12 9Z" />
    </svg>
  );
}

// ── Shared UI atoms ──────────────────────────────────────────────────────────
function GoldBar() {
  return (
    <div style={{
      position: "absolute", top: 0, left: 0, right: 0, height: 3,
      background: `linear-gradient(90deg, ${C.gold} 0%, ${C.gold2} 50%, ${C.gold} 100%)`,
    }} />
  );
}

function Grain() {
  return (
    <div style={{
      position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, opacity: 0.025,
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
      backgroundSize: "256px",
    }} />
  );
}

function GoldButton({ children, onClick, disabled, style }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      padding: "16px 0", width: "100%",
      background: disabled ? C.faint : C.gold,
      border: "none", cursor: disabled ? "not-allowed" : "pointer",
      fontFamily: "sans-serif", fontSize: 12, fontWeight: 700,
      color: disabled ? C.dim : C.bg, letterSpacing: "0.2em", textTransform: "uppercase",
      transition: "opacity 0.2s", ...style,
    }}>{children}</button>
  );
}

function GhostButton({ children, onClick, disabled, style }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      padding: "14px 0", width: "100%",
      background: "transparent", border: `1px solid ${disabled ? C.border : C.gold}`,
      cursor: disabled ? "not-allowed" : "pointer",
      fontFamily: "sans-serif", fontSize: 12,
      color: disabled ? C.dim : C.gold, letterSpacing: "0.15em", textTransform: "uppercase",
      transition: "border-color 0.2s, color 0.2s", ...style,
    }}>{children}</button>
  );
}

// ── Nav bar ───────────────────────────────────────────────────────────────────
function NavBar({ screen, onNav }) {
  const items = [
    { id: "home", label: "Home" },
    { id: "catalog", label: "Catalog" },
    { id: "meeting", label: "Book a Meeting" },
  ];
  return (
    <div style={{
      position: "sticky", top: 0, zIndex: 60,
      background: "rgba(8,8,8,0.92)", backdropFilter: "blur(8px)",
      borderBottom: `1px solid ${C.border}`,
    }}>
      <div style={{
        maxWidth: 960, margin: "0 auto", padding: "16px 20px",
        display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12,
      }}>
        <div onClick={() => onNav("home")} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: C.gold }} />
          <span style={{ fontFamily: "sans-serif", fontSize: 13, color: C.white, letterSpacing: "0.2em", fontWeight: 700 }}>
            {BRAND_NAME}
          </span>
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          {items.map((it) => (
            <button key={it.id} onClick={() => onNav(it.id)} style={{
              background: screen === it.id ? C.goldDim : "transparent",
              border: "none", cursor: "pointer",
              padding: "8px 14px",
              fontFamily: "sans-serif", fontSize: 11.5, letterSpacing: "0.1em", textTransform: "uppercase",
              color: screen === it.id ? C.gold : C.dim,
            }}>{it.label}</button>
          ))}
        </div>
      </div>
    </div>
  );
}

function WhatsAppFab({ onClick }) {
  return (
    <button onClick={onClick} style={{
      position: "fixed", bottom: 24, right: 24, zIndex: 100,
      background: C.gold, border: "none", borderRadius: "50%",
      width: 54, height: 54, cursor: "pointer",
      display: "flex", alignItems: "center", justifyContent: "center",
      boxShadow: "0 12px 30px rgba(0,0,0,0.5)",
    }} aria-label="Chat on WhatsApp">
      <svg width="24" height="24" viewBox="0 0 24 24" fill={C.bg}>
        <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5.1-1.3A10 10 0 1 0 12 2Zm0 18.2a8.1 8.1 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.5.1-.6.8-.7.9-.3.2-.5.1a6.6 6.6 0 0 1-2-1.2 7.4 7.4 0 0 1-1.4-1.7c-.1-.2 0-.4.1-.5l.4-.4.2-.4v-.4c-.1-.1-.5-1.3-.7-1.8s-.4-.4-.5-.4h-.4a.9.9 0 0 0-.6.3 2.7 2.7 0 0 0-.8 2 4.7 4.7 0 0 0 1 2.5 10.7 10.7 0 0 0 4.1 3.7c.6.2 1 .4 1.4.5a3.3 3.3 0 0 0 1.5.1 2.5 2.5 0 0 0 1.6-1.1 2 2 0 0 0 .1-1.1c-.1-.1-.2-.2-.5-.3Z" />
      </svg>
    </button>
  );
}

// ── Screens ───────────────────────────────────────────────────────────────────
function HomeScreen({ onNav }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVisible(true), 100); return () => clearTimeout(t); }, []);

  const highlights = [
    { title: "Sample Before You Commit", body: "Order a sample run of any kit before placing a bulk order." },
    { title: "Volume Pricing", body: "Per-unit cost drops as order quantity scales — ask for a quote." },
    { title: "Custom Branding Available", body: "Property-branded packaging on select kits, MOQ dependent." },
  ];

  return (
    <div style={{ opacity: visible ? 1 : 0, transition: "opacity 0.7s ease" }}>
      {/* Hero */}
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "72px 24px 48px", textAlign: "center" }}>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 10, marginBottom: 28 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: C.gold }} />
          <span style={{ fontFamily: "sans-serif", fontSize: 11, color: C.gold, letterSpacing: "0.3em", textTransform: "uppercase", fontWeight: 700 }}>
            Hotel Amenity Supply
          </span>
        </div>
        <div style={{ fontFamily: "Georgia, serif", fontSize: 40, color: C.white, lineHeight: 1.2, marginBottom: 14 }}>
          {BRAND_TAGLINE}
        </div>
        <p style={{ fontFamily: "sans-serif", fontSize: 15, color: C.dim, lineHeight: 1.75, margin: "0 auto 36px", maxWidth: 520 }}>
          Dental and washroom amenity kits for hotels — browse the catalog,
          order a sample, or get a bulk quote in a few taps. No back-and-forth
          needed to see what's available.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <div style={{ width: 220 }}>
            <GoldButton onClick={() => onNav("catalog")}>Browse Catalog →</GoldButton>
          </div>
          <div style={{ width: 220 }}>
            <GhostButton onClick={() => onNav("meeting")}>Book a Meeting</GhostButton>
          </div>
        </div>
      </div>

      {/* Highlights */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px 64px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
          {highlights.map((h) => (
            <div key={h.title} style={{
              background: C.surface, border: `1px solid ${C.border}`, borderLeft: `3px solid ${C.gold}`,
              padding: "22px 24px",
            }}>
              <div style={{ fontFamily: "Georgia, serif", fontSize: 16, color: C.white, marginBottom: 8 }}>{h.title}</div>
              <div style={{ fontFamily: "sans-serif", fontSize: 13, color: C.dim, lineHeight: 1.6 }}>{h.body}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Category teaser */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px 80px" }}>
        <div style={{ fontFamily: "sans-serif", fontSize: 11, color: C.gold, letterSpacing: "0.25em", textTransform: "uppercase", fontWeight: 700, marginBottom: 20, textAlign: "center" }}>
          WHAT WE SUPPLY
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
          {CATEGORIES.map((cat) => (
            <div key={cat.id} onClick={() => onNav("catalog", cat.id)} style={{
              background: C.surface, border: `1px solid ${C.border}`,
              padding: "28px 24px", cursor: "pointer", textAlign: "center",
              transition: "border-color 0.2s",
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = C.gold; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; }}
            >
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 14 }}>
                <CategoryIcon type={cat.icon} size={30} />
              </div>
              <div style={{ fontFamily: "Georgia, serif", fontSize: 17, color: C.white }}>{cat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProductCard({ product, inQuote, onToggleQuote, onOrderSample }) {
  return (
    <div style={{
      background: C.surface, border: `1px solid ${C.border}`,
      position: "relative", overflow: "hidden",
    }}>
      <GoldBar />
      <div style={{ padding: "26px 24px 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
          <CategoryIcon type={CATEGORIES.find(c => c.id === product.category).icon} size={26} />
          <span style={{
            fontFamily: "sans-serif", fontSize: 10, color: C.gold, letterSpacing: "0.15em",
            textTransform: "uppercase", border: `1px solid ${C.gold}`, padding: "3px 9px",
          }}>{product.tier}</span>
        </div>
        <div style={{ fontFamily: "Georgia, serif", fontSize: 19, color: C.white, marginBottom: 6 }}>{product.name}</div>
        <div style={{ fontFamily: "sans-serif", fontSize: 12.5, color: C.gold, marginBottom: 12 }}>{product.tagline}</div>
        <p style={{ fontFamily: "sans-serif", fontSize: 13, color: C.dim, lineHeight: 1.65, margin: "0 0 14px" }}>
          {product.description}
        </p>
        <div style={{ fontFamily: "sans-serif", fontSize: 11.5, color: C.dim, marginBottom: 20 }}>
          MOQ: <span style={{ color: C.white }}>{product.moq}</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <GoldButton onClick={() => onOrderSample(product)} style={{ padding: "12px 0", fontSize: 11 }}>
            Order Sample
          </GoldButton>
          <button onClick={() => onToggleQuote(product.id)} style={{
            width: "100%", padding: "10px 0",
            background: inQuote ? C.goldDim : "transparent",
            border: `1px solid ${inQuote ? C.gold : C.border}`,
            color: inQuote ? C.gold : C.dim,
            fontFamily: "sans-serif", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase",
            cursor: "pointer",
          }}>
            {inQuote ? "✓ Added to Quote" : "+ Add to Bulk Quote"}
          </button>
        </div>
      </div>
    </div>
  );
}

function CatalogScreen({ initialFilter, quoteIds, onToggleQuote, onOrderSample, onRequestQuote }) {
  const [filter, setFilter] = useState(initialFilter || "all");
  const filtered = filter === "all" ? PRODUCTS : PRODUCTS.filter((p) => p.category === filter);

  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: "40px 24px 120px" }}>
      <div style={{ fontFamily: "Georgia, serif", fontSize: 28, color: C.white, marginBottom: 6 }}>The Catalog</div>
      <p style={{ fontFamily: "sans-serif", fontSize: 13.5, color: C.dim, marginBottom: 28 }}>
        Order a sample of any kit, or add several to a bulk quote request.
      </p>

      <div style={{ display: "flex", gap: 8, marginBottom: 28, flexWrap: "wrap" }}>
        {["all", ...CATEGORIES.map(c => c.id)].map((id) => {
          const label = id === "all" ? "All Kits" : CATEGORIES.find(c => c.id === id).label;
          const active = filter === id;
          return (
            <button key={id} onClick={() => setFilter(id)} style={{
              background: active ? C.goldDim : "transparent",
              border: `1px solid ${active ? C.gold : C.border}`,
              color: active ? C.gold : C.dim,
              fontFamily: "sans-serif", fontSize: 11.5, letterSpacing: "0.1em", textTransform: "uppercase",
              padding: "9px 16px", cursor: "pointer",
            }}>{label}</button>
          );
        })}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20 }}>
        {filtered.map((p) => (
          <ProductCard
            key={p.id}
            product={p}
            inQuote={quoteIds.includes(p.id)}
            onToggleQuote={onToggleQuote}
            onOrderSample={onOrderSample}
          />
        ))}
      </div>

      {quoteIds.length > 0 && (
        <div style={{
          position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 90,
          background: C.surface, borderTop: `1px solid ${C.gold}`,
          boxShadow: "0 -16px 40px rgba(0,0,0,0.5)",
        }}>
          <div style={{
            maxWidth: 960, margin: "0 auto", padding: "16px 24px",
            display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12,
          }}>
            <span style={{ fontFamily: "sans-serif", fontSize: 13, color: C.white }}>
              <span style={{ color: C.gold, fontWeight: 700 }}>{quoteIds.length}</span> item{quoteIds.length > 1 ? "s" : ""} selected for quote
            </span>
            <div style={{ width: 220 }}>
              <GoldButton onClick={onRequestQuote} style={{ padding: "12px 0", fontSize: 11 }}>
                Get Bulk Quote →
              </GoldButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Lead form (sample / bulk / meeting / general) ────────────────────────────
function LeadFormScreen({ intent, products, fields, onChange, onSend, onBack }) {
  const titleMap = {
    sample: "Request a Sample",
    bulk: "Request a Bulk Quote",
    meeting: "Book a Meeting",
    general: "Get in Touch",
  };
  const subMap = {
    sample: "We'll ship a sample run and follow up on pricing.",
    bulk: "Tell us your estimated volume and we'll send a quote.",
    meeting: "Pick a time that works — we'll confirm by WhatsApp or email.",
    general: "Send us a message and we'll get back to you.",
  };

  const baseFields = [
    { key: "name", label: "Full Name", type: "text", placeholder: "e.g. Anita Rao" },
    { key: "hotel", label: "Hotel / Property Name", type: "text", placeholder: "e.g. Sunrise Grand Hotel" },
    { key: "city", label: "City", type: "text", placeholder: "e.g. Pune" },
    { key: "email", label: "Email", type: "email", placeholder: "e.g. anita@hotel.com" },
    { key: "phone", label: "Phone (with country code)", type: "tel", placeholder: "e.g. +91 98765 43210" },
  ];

  const intentFields = {
    sample: [
      { key: "shippingAddress", label: "Shipping Address", type: "text", placeholder: "Where should the sample go?" },
    ],
    bulk: [
      { key: "quantity", label: "Estimated Order Quantity", type: "text", placeholder: "e.g. 2,000 units / month" },
    ],
    meeting: [
      { key: "preferredDate", label: "Preferred Date", type: "date" },
      { key: "preferredTime", label: "Preferred Time", type: "time" },
      { key: "mode", label: "Meeting Mode", type: "select", options: ["Phone Call", "Video Call", "In-Person"] },
    ],
    general: [],
  };

  const allFields = [...baseFields, ...intentFields[intent]];

  const required = ["name", "hotel", "email", "phone"];
  const valid = required.every((k) => fields[k] && fields[k].trim() !== "") &&
    /\S+@\S+\.\S+/.test(fields.email || "");

  return (
    <div style={{ maxWidth: 560, margin: "0 auto", padding: "40px 24px 80px" }}>
      <button onClick={onBack} style={{
        background: "none", border: "none", color: C.dim, cursor: "pointer",
        fontFamily: "sans-serif", fontSize: 12, marginBottom: 20, padding: 0,
      }}>← Back</button>

      <div style={{
        background: C.surface, border: `1px solid ${C.border}`,
        position: "relative", overflow: "hidden", boxShadow: "0 24px 64px rgba(0,0,0,0.6)",
      }}>
        <GoldBar />
        <div style={{ padding: "36px 32px" }}>
          <div style={{ fontFamily: "Georgia, serif", fontSize: 22, color: C.white, marginBottom: 8 }}>
            {titleMap[intent]}
          </div>
          <p style={{ fontFamily: "sans-serif", fontSize: 13, color: C.dim, marginBottom: 8 }}>{subMap[intent]}</p>

          {products && products.length > 0 && (
            <div style={{ background: C.card, borderLeft: `3px solid ${C.gold}`, padding: "12px 16px", margin: "16px 0 8px" }}>
              <div style={{ fontFamily: "sans-serif", fontSize: 10, color: C.gold, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 6 }}>
                {products.length > 1 ? "Selected Items" : "Selected Item"}
              </div>
              {products.map((p) => (
                <div key={p.id} style={{ fontFamily: "sans-serif", fontSize: 13, color: C.white }}>{p.name}</div>
              ))}
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 24 }}>
            {allFields.map((f) => (
              <div key={f.key}>
                <label style={{
                  display: "block", fontFamily: "sans-serif", fontSize: 11,
                  color: C.dim, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8,
                }}>{f.label}</label>
                {f.type === "select" ? (
                  <select
                    value={fields[f.key] || ""}
                    onChange={(e) => onChange(f.key, e.target.value)}
                    style={{
                      width: "100%", boxSizing: "border-box",
                      background: C.card, border: `1px solid ${C.border}`,
                      color: C.white, fontFamily: "sans-serif", fontSize: 15,
                      padding: "14px 16px", outline: "none",
                    }}
                  >
                    <option value="">Select…</option>
                    {f.options.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                ) : (
                  <input
                    type={f.type}
                    placeholder={f.placeholder}
                    value={fields[f.key] || ""}
                    onChange={(e) => onChange(f.key, e.target.value)}
                    style={{
                      width: "100%", boxSizing: "border-box",
                      background: C.card, border: `1px solid ${C.border}`,
                      color: C.white, fontFamily: "sans-serif", fontSize: 15,
                      padding: "14px 16px", outline: "none",
                    }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = C.gold; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = C.border; }}
                  />
                )}
              </div>
            ))}
          </div>

          <div style={{ marginTop: 28, display: "flex", flexDirection: "column", gap: 10 }}>
            <GoldButton disabled={!valid} onClick={() => onSend("whatsapp")}>
              Send via WhatsApp →
            </GoldButton>
            <GhostButton disabled={!valid} onClick={() => onSend("email")}>
              Send via Email Instead
            </GhostButton>
          </div>
        </div>
      </div>
    </div>
  );
}

function ConfirmationScreen({ intent, onHome }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVisible(true), 100); return () => clearTimeout(t); }, []);

  const msgMap = {
    sample: "Your sample request is ready to send.",
    bulk: "Your bulk quote request is ready to send.",
    meeting: "Your meeting request is ready to send.",
    general: "Your message is ready to send.",
  };

  return (
    <div style={{
      minHeight: "60vh", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", padding: "60px 24px",
      opacity: visible ? 1 : 0, transition: "opacity 0.6s ease", textAlign: "center",
    }}>
      <div style={{
        width: 64, height: 64, borderRadius: "50%", background: C.greenDim,
        border: `1px solid ${C.green}`, display: "flex", alignItems: "center", justifyContent: "center",
        marginBottom: 24,
      }}>
        <span style={{ color: C.green, fontSize: 28 }}>✓</span>
      </div>
      <div style={{ fontFamily: "Georgia, serif", fontSize: 22, color: C.white, marginBottom: 10 }}>
        {msgMap[intent]}
      </div>
      <p style={{ fontFamily: "sans-serif", fontSize: 13.5, color: C.dim, lineHeight: 1.7, marginBottom: 32, maxWidth: 420 }}>
        A message has opened on your device — send it from there to reach us.
        Nothing is stored automatically; we only see what you choose to send.
      </p>
      <div style={{ width: 240 }}>
        <GhostButton onClick={onHome}>Back to Home</GhostButton>
      </div>
    </div>
  );
}

// ── Message building ─────────────────────────────────────────────────────────
function buildSummary(intent, products, fields) {
  const lines = [`${titleFor(intent)} — ${BRAND_NAME}`, ""];
  lines.push(`Name: ${fields.name || "-"}`);
  lines.push(`Hotel/Property: ${fields.hotel || "-"}`);
  if (fields.city) lines.push(`City: ${fields.city}`);
  lines.push(`Email: ${fields.email || "-"}`);
  lines.push(`Phone: ${fields.phone || "-"}`);

  if (products && products.length > 0) {
    lines.push("", "Item(s):");
    products.forEach((p) => lines.push(`- ${p.name}`));
  }

  if (intent === "sample" && fields.shippingAddress) {
    lines.push("", `Shipping Address: ${fields.shippingAddress}`);
  }
  if (intent === "bulk" && fields.quantity) {
    lines.push("", `Estimated Quantity: ${fields.quantity}`);
  }
  if (intent === "meeting") {
    lines.push("", `Preferred Date: ${fields.preferredDate || "-"}`);
    lines.push(`Preferred Time: ${fields.preferredTime || "-"}`);
    lines.push(`Mode: ${fields.mode || "-"}`);
  }

  return lines.join("\n");
}

function titleFor(intent) {
  return { sample: "Sample Request", bulk: "Bulk Quote Request", meeting: "Meeting Request", general: "Inquiry" }[intent];
}

// ── Root ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState("home"); // home | catalog | form | confirmation | meeting
  const [catalogFilter, setCatalogFilter] = useState("all");
  const [quoteIds, setQuoteIds] = useState([]);
  const [intent, setIntent] = useState("general");
  const [formProducts, setFormProducts] = useState([]);
  const [fields, setFields] = useState({});
  const containerRef = useRef(null);

  const scrollTop = () => containerRef.current?.scrollTo({ top: 0, behavior: "smooth" });

  const handleNav = (target, filter) => {
    if (target === "catalog") {
      setCatalogFilter(filter || "all");
      setScreen("catalog");
    } else if (target === "meeting") {
      setIntent("meeting");
      setFormProducts([]);
      setFields({});
      setScreen("form");
    } else if (target === "home") {
      setScreen("home");
    }
    scrollTop();
  };

  const handleToggleQuote = (id) => {
    setQuoteIds((ids) => ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]);
  };

  const handleOrderSample = (product) => {
    setIntent("sample");
    setFormProducts([product]);
    setFields({});
    setScreen("form");
    scrollTop();
  };

  const handleRequestQuote = () => {
    setIntent("bulk");
    setFormProducts(PRODUCTS.filter((p) => quoteIds.includes(p.id)));
    setFields({});
    setScreen("form");
    scrollTop();
  };

  const handleFieldChange = (key, value) => {
    setFields((f) => ({ ...f, [key]: value }));
  };

  const handleSend = (channel) => {
    const summary = buildSummary(intent, formProducts, fields);
    if (channel === "whatsapp") {
      window.open(`https://wa.me/${BRAND_WHATSAPP_NUMBER}?text=${encodeURIComponent(summary)}`, "_blank");
    } else {
      const subject = encodeURIComponent(`${titleFor(intent)} — ${fields.name || ""}`);
      window.location.href = `mailto:${BRAND_EMAIL}?subject=${subject}&body=${encodeURIComponent(summary)}`;
    }
    if (intent === "bulk") setQuoteIds([]);
    setScreen("confirmation");
    scrollTop();
  };

  return (
    <div
      ref={containerRef}
      style={{ minHeight: "100vh", background: C.bg, fontFamily: "Georgia, serif", position: "relative", overflowY: "auto" }}
    >
      <Grain />
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 70, height: 3,
        background: `linear-gradient(90deg, ${C.gold} 0%, ${C.gold2} 50%, ${C.gold} 100%)`,
      }} />

      <div style={{ position: "relative", zIndex: 1 }}>
        <NavBar screen={screen} onNav={handleNav} />

        {screen === "home" && <HomeScreen onNav={handleNav} />}

        {screen === "catalog" && (
          <CatalogScreen
            initialFilter={catalogFilter}
            quoteIds={quoteIds}
            onToggleQuote={handleToggleQuote}
            onOrderSample={handleOrderSample}
            onRequestQuote={handleRequestQuote}
          />
        )}

        {screen === "form" && (
          <LeadFormScreen
            intent={intent}
            products={formProducts}
            fields={fields}
            onChange={handleFieldChange}
            onSend={handleSend}
            onBack={() => setScreen(formProducts.length > 0 ? "catalog" : "home")}
          />
        )}

        {screen === "confirmation" && (
          <ConfirmationScreen intent={intent} onHome={() => handleNav("home")} />
        )}

        {/* Footer */}
        <div style={{ borderTop: `1px solid ${C.border}`, padding: "32px 24px", textAlign: "center" }}>
          <div style={{ fontFamily: "sans-serif", fontSize: 11, color: C.dim, letterSpacing: "0.1em" }}>
            {BRAND_NAME} · {BRAND_HANDLE}
          </div>
          <button onClick={() => { setIntent("general"); setFormProducts([]); setFields({}); setScreen("form"); scrollTop(); }} style={{
            marginTop: 12, background: "none", border: "none", color: C.gold,
            fontFamily: "sans-serif", fontSize: 11.5, letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer",
          }}>
            General Inquiry →
          </button>
        </div>
      </div>

      {screen !== "form" && screen !== "confirmation" && (
        <WhatsAppFab onClick={() => window.open(`https://wa.me/${BRAND_WHATSAPP_NUMBER}`, "_blank")} />
      )}
    </div>
  );
}
