import Link from "next/link";
import Image from "next/image";
import path from "node:path";
import { statSync } from "node:fs";
import {
  galleryItems,
  gallerySituationFilters,
} from "./lib/gallery.js";
import GalleryGrid from "./gallery/GalleryGrid";
import HomePageBottom from "./components/HomePageBottom";
import { LOL_SIGNUP_URL } from "./lib/share-links";

// Append a cache-busting ?v=<mtime> to each gallery PNG URL so the
// browser fetches the latest rerender after we regenerate the gallery.
// Without this, sharp/our render pipeline can write a fresh PNG to
// disk but every <img> on the page keeps the previous response from
// the browser's HTTP cache — the user sees stale art with no way to
// force a refresh besides a hard reload.
function withCacheBust(items) {
  const galleryDir = path.join(process.cwd(), "public", "gallery");
  return items.map((item) => {
    if (!item.file?.startsWith("/gallery/")) return item;
    try {
      const filePath = path.join(galleryDir, item.file.replace("/gallery/", ""));
      const v = statSync(filePath).mtimeMs | 0;
      return { ...item, file: `${item.file}?v=${v}` };
    } catch {
      return item;
    }
  });
}

// ─── Homepage / Gallery ─────────────────────────────────────────────
//
// Browse curated memes, share, or click "Customize this template" to
// rewrite captions for a single template — every action lands in a
// K-8 safety pipeline before anything hits a teacher's group chat.
//
// Sibling routes:
//   /gallery/<id>   permanent share page for a single curated meme
//   /customize?id=  edit-only page for one template (deep link from
//                   gallery cards)
//   /meme/<id>      permanent share page for a user-customized meme

export const metadata = {
  title: "Teacher Meme Library | Legends of Learning",
  description:
    "Hand-picked, classroom-safe teacher memes. Share as-is or rewrite the captions in two clicks.",
  openGraph: {
    title: "Teacher Meme Library",
    description:
      "Hand-picked, classroom-safe teacher memes. Share or remix in two clicks.",
    type: "website",
  },
};

export default function Home() {
  return (
    <>
      <nav className="nav">
        <div className="nav-brand">
          <Image
            src="/legends-logo-white.png"
            alt="Legends of Learning"
            width={110}
            height={40}
            priority
          />
          <span className="nav-title">Teacher Meme Library</span>
        </div>
        <Link
          href={LOL_SIGNUP_URL}
          className="nav-cta"
          target="_blank"
          rel="noopener noreferrer"
        >
          Sign up free
        </Link>
      </nav>

      <section className="hero" aria-labelledby="hero-headline">
        <div className="hero-inner">
          <p className="hero-eyebrow">
            A free tool by <strong>Legends of Learning</strong>
          </p>
          <h1 className="hero-headline" id="hero-headline">
            <span className="hero-headline-teacher">Teacher</span>{" "}
            <span className="hero-headline-meme">Meme</span>{" "}
            <span className="hero-headline-library">Library</span>
        </h1>
          <p className="hero-subhead">
            Because sometimes a meme explains teaching better than a lesson
            plan.
          </p>
          <p className="hero-support">
            Explore funny, classroom-safe memes made for real teacher moments.
          </p>
        </div>
      </section>

      <main className="container gallery-container">
        <GalleryGrid
          items={withCacheBust(galleryItems)}
          filters={gallerySituationFilters}
        />

      </main>

      <HomePageBottom />
    </>
  );
}
