"use client";

import { useCallback, useState } from "react";
import SharePanel from "../../components/SharePanel";
import LolSignupStrip from "../../components/LolSignupStrip";
import { fetchAndDownloadSquare } from "../../lib/download-square";

export default function ShareActions({ meme }) {
  const [toast, setToast] = useState("");

  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2200);
  }, []);

  const captionText =
    Object.values(meme.captions || {})
      .filter((v) => typeof v === "string" && v.trim())
      .join(" / ") || meme.formatName;

  const download = async () => {
    try {
      await fetchAndDownloadSquare(
        meme.pngUrl,
        `teacher-meme-${meme.id}.png`
      );
      showToast("Square meme downloaded");
    } catch {
      showToast("Download failed — try again");
    }
  };

  return (
    <>
      <div className="share-page-actions">
        <button className="action-btn" onClick={download}>
          Download PNG
        </button>
      </div>
      <SharePanel
        share={{
          path: meme.sharePath,
          title: `${meme.formatName} · Teacher meme`,
          text: `Found my new favorite teacher meme — "${captionText}"`,
          imageUrl: meme.pngUrl,
        }}
        onToast={showToast}
      />
      <LolSignupStrip />
      <div className={`toast ${toast ? "visible" : ""}`}>{toast}</div>
    </>
  );
}
