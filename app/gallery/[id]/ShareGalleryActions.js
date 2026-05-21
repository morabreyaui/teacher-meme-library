"use client";

import { useState, useCallback } from "react";
import SharePanel from "../../components/SharePanel";
import LolSignupStrip from "../../components/LolSignupStrip";
import { fetchAndDownloadSquare } from "../../lib/download-square";

export default function ShareGalleryActions({ item }) {
  const [toast, setToast] = useState("");

  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2200);
  }, []);

  const download = async () => {
    try {
      const name =
        item.file.split("?")[0].split("/").pop() || "teacher-meme.png";
      await fetchAndDownloadSquare(item.file, name);
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
      <SharePanel item={item} onToast={showToast} />
      <LolSignupStrip />
      <div className={`toast ${toast ? "visible" : ""}`}>{toast}</div>
    </>
  );
}
