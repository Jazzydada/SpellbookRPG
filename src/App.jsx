import React, { useState, useMemo } from "react";
import { SPELLS, CLASS_SPELLS, CLASS_META, SCHOOL_COLORS, T } from "./data";
import { PHB_PAGES } from "./phbPages";

// ── helpers ──────────────────────────────────────────────────────────────────

function maxSpellLevel(className, charLevel) {
  const meta = CLASS_META[className];
  if (!meta) return 0;
  if (meta.caster === "half") {
    if (charLevel < 2)  return 0;
    if (charLevel < 5)  return 1;
    if (charLevel < 9)  return 2;
    if (charLevel < 13) return 3;
    if (charLevel < 17) return 4;
    return 5;
  }
  if (meta.caster === "warlock") {
    if (charLevel < 3)  return 1;
    if (charLevel < 5)  return 2;
    if (charLevel < 7)  return 3;
    if (charLevel < 9)  return 4;
    return 5;
  }
  // full caster
  if (charLevel < 3)  return 1;
  if (charLevel < 5)  return 2;
  if (charLevel < 7)  return 3;
  if (charLevel < 9)  return 4;
  if (charLevel < 11) return 5;
  if (charLevel < 13) return 6;
  if (charLevel < 15) return 7;
  if (charLevel < 17) return 8;
  return 9;
}

// ── style constants ───────────────────────────────────────────────────────────

const G = {
  bg:     "#0f172a",
  panel:  "rgba(15,23,42,0.97)",
  card:   "rgba(30,41,59,0.7)",
  cardHov:"rgba(30,41,59,0.95)",
  border: "rgba(240,180,41,0.18)",
  gold:   "#f0b429",
  goldL:  "#fcd34d",
  text:   "#f1f5f9",
  muted:  "#94a3b8",
  dim:    "#64748b",
  green:  "#4ade80",
  red:    "#f87171",
};

const inp = {
  background: "rgba(15,23,42,0.8)",
  border: "1px solid " + G.border,
  borderRadius: "0.6rem",
  color: G.text,
  padding: "0.45rem 0.75rem",
  fontSize: "0.9rem",
  outline: "none",
  width: "100%",
};

// ── components ────────────────────────────────────────────────────────────────

function LevelBadge({ level, t }) {
  return (
    <span style={{
      background: "rgba(240,180,41,0.15)",
      border: "1px solid rgba(240,180,41,0.35)",
      borderRadius: "0.4rem",
      color: G.gold,
      fontSize: "0.65rem",
      fontWeight: 700,
      padding: "0.1rem 0.45rem",
      letterSpacing: "0.06em",
      textTransform: "uppercase",
      whiteSpace: "nowrap",
    }}>
      {level === 0 ? t.cantrips : `${t.level} ${level}`}
    </span>
  );
}

function SchoolBadge({ school }) {
  const color = SCHOOL_COLORS[school] || G.muted;
  return (
    <span style={{
      background: color + "22",
      border: "1px solid " + color + "55",
      borderRadius: "0.4rem",
      color,
      fontSize: "0.6rem",
      fontWeight: 700,
      padding: "0.1rem 0.45rem",
      letterSpacing: "0.06em",
      textTransform: "uppercase",
      whiteSpace: "nowrap",
    }}>
      {school}
    </span>
  );
}

function SpellCard({ name, spell, checked, onToggle, lang, t }) {
  const [hov, setHov] = useState(false);
  const desc = spell[lang] || spell.en;
  const phbPage = PHB_PAGES[name];
  const pdfPage = phbPage ? Math.max(1, phbPage - 1) : null;

  return (
    <div
      onClick={onToggle}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "flex",
        gap: "0.75rem",
        alignItems: "flex-start",
        background: checked
          ? "rgba(74,222,128,0.07)"
          : hov ? G.cardHov : G.card,
        border: `1px solid ${checked ? "rgba(74,222,128,0.35)" : G.border}`,
        borderRadius: "0.75rem",
        padding: "0.75rem 1rem",
        cursor: "pointer",
        transition: "background 0.15s, border-color 0.15s",
      }}
    >
      {/* checkbox */}
      <div style={{
        flexShrink: 0,
        width: 18,
        height: 18,
        borderRadius: "0.3rem",
        border: `2px solid ${checked ? G.green : G.dim}`,
        background: checked ? G.green : "transparent",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 2,
        transition: "all 0.15s",
      }}>
        {checked && <span style={{ color: "#0f172a", fontSize: 11, fontWeight: 900, lineHeight: 1 }}>✓</span>}
      </div>
      {/* content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "0.4rem", marginBottom: "0.3rem" }}>
          <span style={{ color: G.text, fontWeight: 700, fontSize: "0.9rem" }}>{name}</span>
          <SchoolBadge school={spell.school} />
          {phbPage ? (
            <a
              href={`./phb2024.pdf#page=${pdfPage}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              title={lang === "da"
                ? `Åbn din lokale PHB 2024 PDF på side ${phbPage}. Læg filen som public/phb2024.pdf.`
                : `Open your local PHB 2024 PDF on page ${phbPage}. Place it as public/phb2024.pdf.`}
              style={{
                color: G.goldL,
                fontSize: "0.66rem",
                fontWeight: 800,
                textDecoration: "none",
                border: "1px solid rgba(252,211,77,0.35)",
                borderRadius: "0.35rem",
                padding: "0.08rem 0.4rem",
                background: "rgba(240,180,41,0.08)",
                whiteSpace: "nowrap",
              }}
            >
              {lang === "da" ? `PHB 2024 s. ${phbPage}` : `PHB 2024 p. ${phbPage}`}
            </a>
          ) : (
            <span style={{
              color: G.dim,
              fontSize: "0.62rem",
              fontWeight: 700,
              border: "1px solid rgba(100,116,139,0.25)",
              borderRadius: "0.35rem",
              padding: "0.08rem 0.4rem",
              whiteSpace: "nowrap",
            }}>
              {lang === "da" ? "Ikke i PHB 2024" : "Not in PHB 2024"}
            </span>
          )}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", marginBottom: "0.35rem" }}>
          {[
            [t.castTime, spell.cast],
            [t.range,    spell.range],
            [t.duration, spell.dur],
          ].map(([label, val]) => (
            <span key={label} style={{ fontSize: "0.7rem", color: G.muted }}>
              <span style={{ color: G.dim, marginRight: 3 }}>{label}:</span>{val}
            </span>
          ))}
        </div>
        <p style={{ margin: 0, fontSize: "0.78rem", color: G.muted, lineHeight: 1.5 }}>{desc}</p>
      </div>
    </div>
  );
}

function SpellLevelSection({ level, spells, selected, onToggle, lang, t }) {
  const [collapsed, setCollapsed] = useState(false);
  if (!spells.length) return null;
  return (
    <div style={{ marginBottom: "1rem" }}>
      <button
        onClick={() => setCollapsed(c => !c)}
        style={{
          background: "transparent",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          marginBottom: "0.5rem",
          padding: "0.2rem 0",
          width: "100%",
          textAlign: "left",
        }}
      >
        <LevelBadge level={level} t={t} />
        <span style={{ color: G.dim, fontSize: "0.72rem" }}>
          {spells.length} {lang === "da" ? "trylleformler" : "spells"}
        </span>
        <span style={{ color: G.dim, fontSize: "0.75rem", marginLeft: "auto" }}>
          {collapsed ? "▶" : "▼"}
        </span>
      </button>
      {!collapsed && (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
          {spells.map(name => (
            <SpellCard
              key={name}
              name={name}
              spell={SPELLS[name]}
              checked={!!selected[name]}
              onToggle={() => onToggle(name)}
              lang={lang}
              t={t}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ── main app ──────────────────────────────────────────────────────────────────

export default function App() {
  const [lang, setLang]         = useState("en");
  const [className, setClass]   = useState("Wizard");
  const [charLevel, setLevel]   = useState(5);
  const [levelFilter, setLF]    = useState("all");
  const [search, setSearch]     = useState("");
  const [selected, setSelected] = useState({});

  const t = T[lang];
  const meta = CLASS_META[className] || {};
  const maxSL = maxSpellLevel(className, charLevel);
  const classSpells = CLASS_SPELLS[className] || {};

  // Build filtered spell groups
  const spellGroups = useMemo(() => {
    const groups = {};
    const sl = search.toLowerCase();
    const levels = levelFilter === "all"
      ? Object.keys(classSpells).map(Number).filter(l => l <= maxSL)
      : [Number(levelFilter)].filter(l => l <= maxSL);

    levels.sort((a, b) => a - b);

    for (const level of levels) {
      const names = (classSpells[level] || []).filter(name => {
        if (!SPELLS[name]) return false;
        if (!sl) return true;
        return (
          name.toLowerCase().includes(sl) ||
          (SPELLS[name].en || "").toLowerCase().includes(sl) ||
          (SPELLS[name].da || "").toLowerCase().includes(sl) ||
          (SPELLS[name].school || "").toLowerCase().includes(sl)
        );
      });
      if (names.length) groups[level] = names;
    }
    return groups;
  }, [className, charLevel, search, levelFilter, maxSL]);

  function toggleSpell(name) {
    setSelected(s => {
      const n = { ...s };
      n[name] ? delete n[name] : (n[name] = true);
      return n;
    });
  }

  const selectedNames = Object.keys(selected);

  // Available levels for filter dropdown
  const availLevels = Object.keys(classSpells)
    .map(Number)
    .filter(l => l <= maxSL)
    .sort((a, b) => a - b);

  return (
    <div style={{
      minHeight: "100vh",
      background: G.bg,
      color: G.text,
      fontFamily: "'Segoe UI', system-ui, sans-serif",
    }}>
      {/* ── header ── */}
      <div style={{
        background: "rgba(15,23,42,0.98)",
        borderBottom: "1px solid " + G.border,
        padding: "1rem 1.5rem",
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.15rem" }}>
              <span style={{ fontSize: "1.4rem" }}>📖</span>
              <h1 style={{ margin: 0, fontSize: "1.5rem", fontWeight: 900, color: G.gold }}>{t.title}</h1>
            </div>
            <p style={{ margin: 0, fontSize: "0.75rem", color: G.muted }}>
              {t.subtitle}{" "}
              <a href="https://asaheim.dk" target="_blank" rel="noopener noreferrer"
                style={{ color: G.gold, textDecoration: "underline" }}>
                asaheim.dk
              </a>
            </p>
          </div>
          {/* language toggle */}
          <button
            onClick={() => setLang(l => l === "en" ? "da" : "en")}
            style={{
              background: "rgba(240,180,41,0.1)",
              border: "1px solid " + G.border,
              borderRadius: "0.6rem",
              color: G.gold,
              cursor: "pointer",
              fontWeight: 700,
              fontSize: "0.8rem",
              padding: "0.4rem 0.9rem",
              letterSpacing: "0.08em",
              flexShrink: 0,
            }}
          >
            🌐 {t.lang}
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "1.5rem 1rem" }}>
        {/* ── controls ── */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          gap: "0.75rem",
          marginBottom: "1.5rem",
        }}>
          {/* class */}
          <div>
            <label style={{ display:"block", fontSize:"0.7rem", color:G.dim, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:"0.3rem", fontWeight:700 }}>
              {t.selectClass}
            </label>
            <select value={className} onChange={e => { setClass(e.target.value); setSelected({}); setLF("all"); }} style={inp}>
              {Object.keys(CLASS_SPELLS).map(c => (
                <option key={c} value={c}>
                  {lang === "da" ? `${c} (${CLASS_META[c]?.da})` : c}
                </option>
              ))}
            </select>
          </div>
          {/* level */}
          <div>
            <label style={{ display:"block", fontSize:"0.7rem", color:G.dim, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:"0.3rem", fontWeight:700 }}>
              {t.charLevel}: <span style={{ color: G.gold }}>{charLevel}</span>
            </label>
            <input
              type="range" min={1} max={20} value={charLevel}
              onChange={e => setLevel(Number(e.target.value))}
              style={{ width:"100%", accentColor: G.gold }}
            />
            <div style={{ display:"flex", justifyContent:"space-between", fontSize:"0.65rem", color:G.dim }}>
              <span>1</span>
              <span style={{ color: G.muted }}>
                {lang === "da" ? `Maks. stavniveau: ${maxSL}` : `Max spell level: ${maxSL}`}
              </span>
              <span>20</span>
            </div>
          </div>
          {/* spell level filter */}
          <div>
            <label style={{ display:"block", fontSize:"0.7rem", color:G.dim, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:"0.3rem", fontWeight:700 }}>
              {t.level}
            </label>
            <select value={levelFilter} onChange={e => setLF(e.target.value)} style={inp}>
              <option value="all">{t.allLevels}</option>
              {availLevels.map(l => (
                <option key={l} value={l}>
                  {l === 0 ? t.cantrips : `${t.level} ${l}`}
                </option>
              ))}
            </select>
          </div>
          {/* search */}
          <div>
            <label style={{ display:"block", fontSize:"0.7rem", color:G.dim, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:"0.3rem", fontWeight:700 }}>
              {lang === "da" ? "Søg" : "Search"}
            </label>
            <input
              type="text" value={search} placeholder={t.searchPlaceholder}
              onChange={e => setSearch(e.target.value)}
              style={{ ...inp }}
            />
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1.5rem" }}>
          {/* ── spell list ── */}
          <div>
            {Object.keys(spellGroups).length === 0 ? (
              <div style={{ color: G.muted, fontStyle:"italic", textAlign:"center", padding:"2rem" }}>
                {t.noSpells}
              </div>
            ) : (
              Object.entries(spellGroups).map(([level, names]) => (
                <SpellLevelSection
                  key={level}
                  level={Number(level)}
                  spells={names}
                  selected={selected}
                  onToggle={toggleSpell}
                  lang={lang}
                  t={t}
                />
              ))
            )}
          </div>

          {/* ── selected spells panel ── */}
          {selectedNames.length > 0 && (
            <div style={{
              background: G.card,
              border: "1px solid " + G.border,
              borderRadius: "1rem",
              padding: "1rem 1.25rem",
            }}>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"0.75rem" }}>
                <span style={{ fontWeight:800, fontSize:"0.85rem", color:G.gold, textTransform:"uppercase", letterSpacing:"0.08em" }}>
                  {t.selected} ({selectedNames.length})
                </span>
                <button
                  onClick={() => setSelected({})}
                  style={{ background:"transparent", border:"none", color:G.red, cursor:"pointer", fontSize:"0.75rem", fontWeight:700 }}
                >
                  {t.clearAll}
                </button>
              </div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:"0.4rem" }}>
                {selectedNames.map(name => {
                  const sp = SPELLS[name];
                  const color = sp ? SCHOOL_COLORS[sp.school] || G.muted : G.muted;
                  return (
                    <span
                      key={name}
                      onClick={() => toggleSpell(name)}
                      title={sp ? (sp[lang] || sp.en) : ""}
                      style={{
                        background: color + "22",
                        border: "1px solid " + color + "55",
                        borderRadius: "0.5rem",
                        color,
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        padding: "0.25rem 0.6rem",
                        cursor: "pointer",
                        userSelect: "none",
                      }}
                    >
                      {name} ×
                    </span>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── footer ── */}
      <div style={{
        borderTop: "1px solid " + G.border,
        padding: "1rem 1.5rem",
        textAlign: "center",
        fontSize: "0.72rem",
        color: G.dim,
        marginTop: "2rem",
      }}>
        SpellbookRPG · PHB 2024 sidehenvisninger ·{" "}
        <a href="https://asaheim.dk" target="_blank" rel="noopener noreferrer" style={{ color: G.gold }}>
          asaheim.dk
        </a>
      </div>
    </div>
  );
}
