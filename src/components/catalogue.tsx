"use client";
import { useEffect, useRef, useState } from "react";
import { EnquiryModal } from "./enquiry-modal";
import type { Artwork, Currency, Status } from "@/data/artworks";
import { messages, locales, workCount, type Language } from "@/data/i18n";
import {
  localizeArtwork,
  type LocalizedArtwork,
} from "@/data/artwork-translations";
type Filter = "all" | Status | "saved";
function Bookmark({ filled = false }: { filled?: boolean }) {
  return (
    <svg
      width="20"
      height="22"
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <path d="M6 3h12v18l-6-4-6 4z" />
    </svg>
  );
}
function ArtworkCard({
  artwork,
  saved,
  onSave,
  onContact,
  language,
  currency,
  onCurrencyChange,
}: {
  currency: Currency;
  onCurrencyChange: (value: Currency) => void;
  language: Language;
  artwork: LocalizedArtwork;
  saved: boolean;
  onSave: () => void;
  onContact: (a: LocalizedArtwork) => void;
}) {
  const t = messages[language];
  const labels =
    language === "pl"
      ? {
          available: "Dostępna",
          reserved: "Zarezerwowana",
          exhibition: "Na wystawie",
          sold: "Sprzedana",
        }
      : language === "fr"
        ? {
            available: "Disponible",
            reserved: "Réservée",
            exhibition: "En exposition",
            sold: "Vendue",
          }
        : t;
  const [active, setActive] = useState(0);
  const track = useRef<HTMLDivElement>(null);
  const activePhoto = useRef(0);
  // Only real viewport-width changes may realign the current slide.
  // Image loading and slide changes never resize the gallery or cancel its animation.
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    let width = el.clientWidth;
    const observer = new ResizeObserver(() => {
      if (el.clientWidth === width) return;
      width = el.clientWidth;
      el.scrollTo({ left: activePhoto.current * width, behavior: "instant" });
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  function go(index: number) {
    const el = track.current;
    if (!el) return;
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    el.scrollTo({
      left: index * el.clientWidth,
      behavior: reducedMotion ? "instant" : "smooth",
    });
  }
  return (
    <article id={`artwork-${artwork.id}`}  className="art-card" aria-labelledby={`title-${artwork.id}`}>
      <div className="image-wrap">
        <div
          className="image-track"
          ref={track}
          onScroll={(e) => {
            const el = e.currentTarget;
            const index = Math.max(
              0,
              Math.min(
                artwork.images.length - 1,
                Math.round(el.scrollLeft / el.clientWidth),
              ),
            );
            activePhoto.current = index;
            setActive(index);
          }}
          tabIndex={0}
          role="region"
          aria-label={`${artwork.title} — ${t.photos}`}
          onKeyDown={(e) => {
            if (e.key === "ArrowRight") {
              e.preventDefault();
              go(Math.min(active + 1, artwork.images.length - 1));
            }
            if (e.key === "ArrowLeft") {
              e.preventDefault();
              go(Math.max(active - 1, 0));
            }
          }}
        >
          {artwork.images.map((image, index) => (
            <div className="image-slide" key={image.src}>
              <img
                src={image.src}
                alt={image.alt}
                width="1920"
                height="1280"
                loading={index === 0 ? "eager" : "lazy"}
                draggable={false}
              />
            </div>
          ))}
        </div>
        <span className="image-count">
          {active + 1} / {artwork.images.length}
        </span>
        <button
          className="photo-arrow prev"
          disabled={active === 0}
          aria-label={t.prev}
          onClick={() => go(active - 1)}
        >
          ‹
        </button>
        <button
          className="photo-arrow next"
          disabled={active === artwork.images.length - 1}
          aria-label={t.next}
          onClick={() => go(active + 1)}
        >
          ›
        </button>
      </div>
      <div className="card-tools">
        <span className="photo-hint">{`${active + 1} / ${artwork.images.length}`}</span>
        <div className="dots">
          {artwork.images.map((image, i) => (
            <button
              key={image.src}
              aria-label={`${t.show} ${i + 1}`}
              aria-pressed={i === active}
              onClick={() => go(i)}
            >
              <span className={i === active ? "active" : ""} />
            </button>
          ))}
        </div>
        <button
          className="save-button"
          aria-label={`${saved ? t.unsave : t.save} ${artwork.title}`}
          aria-pressed={saved}
          onClick={onSave}
        >
          <Bookmark filled={saved} />
        </button>
      </div>
      <div className="card-copy">
        <div className="title-row">
          <h2 id={`title-${artwork.id}`}>{artwork.title}</h2>
          <span>{artwork.year}</span>
        </div>
        <details className="artwork-details">
          <summary>
            <span className="material-text">
              {[artwork.dimensions, artwork.medium].filter(Boolean).join(" · ")}
            </span>{" "}
            <span className="more-label">… {t.more}</span>
          </summary>
          <p>{artwork.description}</p>
          <span className={`status ${artwork.status}`}>
            <i />
            {labels[artwork.status]}
          </span>
          <div className="purchase-row">
            <div className="pricing">
              <div
                className="currency-switch"
                role="group"
                aria-label={t.currencyLabel}
              >
                {(["PLN", "EUR"] as const).map((value) => (
                  <button
                    key={value}
                    aria-pressed={currency === value}
                    onClick={() => onCurrencyChange(value)}
                  >
                    {value}
                  </button>
                ))}
              </div>
              <div className="price">
                {artwork.prices[currency] == null
                  ? t.priceOnRequest
                  : new Intl.NumberFormat(locales[language], {
                      style: "currency",
                      currency,
                      maximumFractionDigits: 2,
                    }).format(artwork.prices[currency]!)}
              </div>
            </div>
            {artwork.status !== "sold" ? (
              <button
                className={`contact-button ${artwork.status === "available" ? "primary" : ""}`}
                onClick={() => onContact(artwork)}
              >
                {t.enquire}{" "}
                <span>↗</span>
              </button>
            ) : (
              <span className="collected">{t.collected}</span>
            )}
          </div>
        </details>
      </div>
    </article>
  );
}
export function Catalogue({
  artworks: sourceArtworks,
}: {
  artworks: Artwork[];
}) {
  const [currency, setCurrency] = useState<Currency>("PLN");
  const [language, setLanguage] = useState<Language>("en");
  const t = messages[language];
  const labels = t;
  const artworks = sourceArtworks.map((a) => localizeArtwork(a, language));

  const [filter, setFilter] = useState<Filter>("all");
  const [saved, setSaved] = useState<string[]>([]);
  const [ready, setReady] = useState(false);
  const [contact, setContact] = useState<Artwork | null>(null);
  useEffect(() => {
    try {
      const stored = localStorage.getItem("dz-language");
      const preferred = stored || navigator.language.slice(0, 2);
      if (preferred === "pl" || preferred === "en" || preferred === "fr")
        setLanguage(preferred);
    } catch {}
  }, []);
  useEffect(() => {
    document.documentElement.lang = language;
    document.title = "Event Horizon — Dawid Żynda";
  }, [language, t]);
  useEffect(() => {
    try {
      const value = localStorage.getItem("dz-currency");
      if (value === "PLN" || value === "EUR") setCurrency(value);
    } catch {}
  }, []);
  function changeCurrency(value: Currency) {
    setCurrency(value);
    try {
      localStorage.setItem("dz-currency", value);
    } catch {}
  }
  function changeLanguage(value: Language) {
    setLanguage(value);
    try {
      localStorage.setItem("dz-language", value);
    } catch {}
  }
  useEffect(() => {
    try {
      const value = JSON.parse(localStorage.getItem("dz-saved") || "[]");
      if (Array.isArray(value))
        setSaved(
          value.filter((id: unknown): id is string => typeof id === "string"),
        );
    } catch {}
    setReady(true);
  }, []);
  useEffect(() => {
    if (ready)
      try {
        localStorage.setItem("dz-saved", JSON.stringify(saved));
      } catch {}
  }, [saved, ready]);
  const visible = artworks.filter(
    (a) =>
      filter === "all" ||
      (filter === "saved" ? saved.includes(a.id) : a.status === filter),
  );
  return (
    <>
      <header className="site-header">
        <a className="wordmark" href="/">
          DAWID ŻYNDA
        </a>
        <div className="header-actions">
          <div
            className="language-switch"
            role="group"
            aria-label="Language / Język / Langue"
          >
            {(["pl", "en", "fr"] as const).map((lang) => (
              <button
                key={lang}
                lang={lang}
                aria-label={
                  { pl: "Polski", en: "English", fr: "Français" }[lang]
                }
                aria-pressed={language === lang}
                onClick={() => changeLanguage(lang)}
              >
                {lang.toUpperCase()}
              </button>
            ))}
          </div>
          <button
            className="saved-link"
            aria-label={t.savedWorks}
            onClick={() => setFilter(filter === "saved" ? "all" : "saved")}
            aria-pressed={filter === "saved"}
          >
            <Bookmark filled={filter === "saved"} /> <span>{t.saved}</span>
            <b>{saved.length}</b>
          </button>
        </div>
      </header>
      <div className="page-shell">
        <main id="collection">
          <div className="feed-heading">
            <div>
              <h1>
                {filter === "all"
                  ? "Event Horizon"
                  : filter === "saved"
                    ? t.savedWorks
                    : labels[filter]}
              </h1>
            </div>
            <span>
              {workCount(visible.length, language)}{" "}
              <span className="down-arrow">↓</span>
            </span>
          </div>
          <div className="mobile-filters" aria-label={t.filter}>
            {(
              ["all", "available", "reserved", "exhibition", "sold"] as const
            ).map((item) => (
              <button
                key={item}
                className={filter === item ? "selected" : ""}
                onClick={() => setFilter(item)}
                aria-pressed={filter === item}
              >
                {item === "all" ? t.all : labels[item]}
              </button>
            ))}
          </div>
          {visible.length ? (
            visible.map((a) => (
              <ArtworkCard
                key={a.id}
                artwork={a}
                language={language}
                currency={currency}
                onCurrencyChange={changeCurrency}
                saved={saved.includes(a.id)}
                onSave={() =>
                  setSaved((old) =>
                    old.includes(a.id)
                      ? old.filter((id) => id !== a.id)
                      : [...old, a.id],
                  )
                }
                onContact={(a) => {
                  const source = sourceArtworks.find(
                    (source) => source.id === a.id,
                  );
                  if (source) setContact(source);
                }}
              />
            ))
          ) : (
            <div className="empty">
              <Bookmark />
              <h2>{t.empty}</h2>
              <p>{t.emptyHelp}</p>
              <button onClick={() => setFilter("all")}>{t.exploreAll} ↗</button>
            </div>
          )}
          <footer>
            <a href="#">{t.top} ↑</a>
            <small>
              © {new Date().getFullYear()} Dawid Żynda · {t.preview}
            </small>
          </footer>
        </main>
      </div>
      {contact && (
        <EnquiryModal key={contact.id} artwork={contact} language={language} onClose={() => setContact(null)} />
      )}
    </>
  );
}
