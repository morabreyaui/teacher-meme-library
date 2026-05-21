"use client";

import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import ShareModal from "../components/ShareModal";
import { fetchAndDownloadSquare } from "../lib/download-square";

function Icon({ name }) {
  const common = {
    width: 16,
    height: 16,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
  };
  switch (name) {
    case "download":
      return (
        <svg {...common}>
          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
      );
    case "copy":
      return (
        <svg {...common}>
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
          <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
        </svg>
      );
    case "share":
      return (
        <svg {...common}>
          <circle cx="18" cy="5" r="3" />
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="19" r="3" />
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
        </svg>
      );
    case "sparkle":
      return (
        <svg {...common}>
          <path d="M12 3v3M12 18v3M5 12H2M22 12h-3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" />
        </svg>
      );
    default:
      return null;
  }
}

export default function GalleryGrid({ items, filters }) {
  const [filterId, setFilterId] = useState("all");
  const [toast, setToast] = useState("");
  const [shareItem, setShareItem] = useState(null);

  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2400);
  }, []);

  const visible = useMemo(() => {
    if (filterId === "all") return items;
    return items.filter((g) => g.situations.includes(filterId));
  }, [items, filterId]);

  const download = useCallback(async (item) => {
    try {
      const name =
        item.file.split("?")[0].split("/").pop() || "teacher-meme.png";
      await fetchAndDownloadSquare(item.file, name);
      showToast("Square meme downloaded");
    } catch {
      showToast("Download failed — try again");
    }
  }, [showToast]);

  return (
    <>
      <div className="gallery-filters">
        {filters.map((f) => (
          <button
            key={f.id}
            className={`chip ${filterId === f.id ? "active" : ""}`}
            onClick={() => setFilterId(f.id)}
          >
            <span className="chip-emoji">{f.emoji}</span>
            <span className="chip-label">{f.label}</span>
          </button>
        ))}
      </div>

      <div className="gallery-meta">
        Showing <strong>{visible.length}</strong> of {items.length} memes
      </div>

      <div className="gallery-grid">
        {visible.map((item) => (
          <article key={item.id} className="gallery-card">
            <div className="gallery-thumb">
              <img src={item.file} alt={item.captionPreview} loading="lazy" />
            </div>
            <div className="gallery-card-body">
              <div className="gallery-format" title={item.formatName}>
                {item.formatName}
              </div>
              <div
                className={`gallery-card-actions${
                  item.remixFormatId &&
                  item.captions &&
                  item.customizable !== false
                    ? " cols-3"
                    : " cols-2"
                }`}
              >
                <button
                  type="button"
                  className="gallery-action-btn"
                  onClick={() => download(item)}
                >
                  <Icon name="download" />
                  <span>Download</span>
                </button>
                <button
                  type="button"
                  className="gallery-action-btn"
                  onClick={() => setShareItem(item)}
                >
                  <Icon name="share" />
                  <span>Share</span>
                </button>
                {item.remixFormatId &&
                item.captions &&
                item.customizable !== false ? (
                  <Link
                    href={`/customize?id=${encodeURIComponent(item.id)}`}
                    className="gallery-action-btn"
                  >
                    <Icon name="sparkle" />
                    <span>Customize</span>
                  </Link>
                ) : null}
              </div>
            </div>
          </article>
        ))}
      </div>

      <ShareModal
        open={Boolean(shareItem)}
        onClose={() => setShareItem(null)}
        item={shareItem}
        onToast={showToast}
      />

      <div className={`toast ${toast ? "visible" : ""}`}>{toast}</div>
    </>
  );
}
