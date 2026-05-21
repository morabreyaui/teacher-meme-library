import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getMeme } from "../../lib/storage";
import ShareActions from "./ShareActions";
import LolSignupCta from "../../components/LolSignupCta";
import { LOL_SIGNUP_URL } from "../../lib/share-links";

export const dynamic = "force-dynamic";

// Build a one-line summary from the caption fields. Used for the
// OG description, Twitter card, and the page subtitle. Designed so
// every format degrades cleanly even though zone keys differ.
function describeCaption(captions) {
  const parts = Object.values(captions || {})
    .map((s) => (typeof s === "string" ? s.trim() : ""))
    .filter(Boolean);
  if (parts.length === 0) return "A teacher meme.";
  return parts.join(" / ");
}

function buildOrigin() {
  // We don't have access to request headers in generateMetadata in the
  // App Router unless we read them via the headers() API. Vercel /
  // Next set this env in production; otherwise fall back to localhost.
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3001";
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const meme = await getMeme(id);
  if (!meme) {
    return { title: "Meme not found · Legends of Learning" };
  }
  const origin = buildOrigin();
  const description = describeCaption(meme.captions);
  const title = `${meme.formatName} · Teacher meme`;
  const fullImageUrl = `${origin}${meme.pngUrl}`;
  const fullPageUrl = `${origin}${meme.sharePath}`;
  return {
    title: `${title} | Legends of Learning`,
    description,
    openGraph: {
      title,
      description,
      url: fullPageUrl,
      siteName: "Legends of Learning",
      type: "article",
      images: [
        {
          url: fullImageUrl,
          alt: `${meme.formatName} teacher meme`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [fullImageUrl],
    },
  };
}

export default async function MemePage({ params }) {
  const { id } = await params;
  const meme = await getMeme(id);
  if (!meme) notFound();

  return (
    <>
      <nav className="nav">
        <Link
          href="/"
          className="nav-brand"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <Image
            src="/legends-logo-white.png"
            alt="Legends of Learning"
            width={110}
            height={40}
            priority
          />
          <span className="nav-title">Teacher Meme Library</span>
        </Link>
        <Link
          href={LOL_SIGNUP_URL}
          className="nav-cta"
          target="_blank"
          rel="noopener noreferrer"
        >
          Sign up free
        </Link>
      </nav>

      <main className="share-page">
        <div className="share-meme-wrap">
          <img
            src={meme.pngUrl}
            alt={`${meme.formatName} teacher meme`}
            // Width/height hints from the format help avoid layout shift.
          />
        </div>

        <div className="share-page-meta">
          <span className="meme-meta-pill">{meme.formatName}</span>
          {meme.toneLabel && (
            <span className="meme-meta-pill subtle">{meme.toneLabel}</span>
          )}
          {meme.situationLabel && (
            <span className="meme-meta-pill subtle">{meme.situationLabel}</span>
          )}
        </div>

        <ShareActions meme={meme} />

        <LolSignupCta />

        <div className="share-cta-card">
          <h2>Make your own</h2>
          <p>
            Browse the library, customize a template, and share in two
            clicks.
          </p>
          <Link href="/" className="cta-button">
            Browse teacher memes
          </Link>
        </div>
      </main>

      <footer className="footer">
        A fun project by{" "}
        <a
          href="https://www.legendsoflearning.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          Legends of Learning
        </a>
      </footer>
    </>
  );
}
