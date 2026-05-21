import Link from "next/link";
import { LOL_ABOUT_URL, LOL_SIGNUP_URL } from "../lib/share-links";
import { LOL_PITCH_BANNER_BODY, LOL_PITCH_CARD } from "../lib/lol-copy";

export default function LolSignupCta({ variant = "card" }) {
  if (variant === "banner") {
    return (
      <aside className="lol-signup-banner" aria-label="Legends of Learning">
        <p>
          <strong>Love game-based learning?</strong> {LOL_PITCH_BANNER_BODY}
        </p>
        <div className="lol-signup-banner-actions">
          <Link
            href={LOL_SIGNUP_URL}
            className="cta-button"
            target="_blank"
            rel="noopener noreferrer"
          >
            Sign up free for teachers
          </Link>
          <Link
            href={LOL_ABOUT_URL}
            className="lol-signup-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn more
          </Link>
        </div>
      </aside>
    );
  }

  return (
    <aside className="lol-signup-card" aria-label="Legends of Learning">
      <h2>Games kids want to play — standards you need to hit</h2>
      <p>{LOL_PITCH_CARD}</p>
      <div className="lol-signup-card-actions">
        <Link
          href={LOL_SIGNUP_URL}
          className="cta-button"
          target="_blank"
          rel="noopener noreferrer"
        >
          Sign up free
        </Link>
        <Link
          href={LOL_ABOUT_URL}
          className="lol-signup-link"
          target="_blank"
          rel="noopener noreferrer"
        >
          More about Legends of Learning
        </Link>
      </div>
    </aside>
  );
}
