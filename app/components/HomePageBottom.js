import Link from "next/link";
import { LOL_ABOUT_URL, LOL_SIGNUP_URL } from "../lib/share-links";
import { LOL_PITCH_BANNER_BODY } from "../lib/lol-copy";

/** Integrated CTA + safety + footer for the home gallery page. */
export default function HomePageBottom() {
  return (
    <section className="home-bottom" aria-labelledby="home-bottom-heading">
      <div className="home-bottom-inner">
        <div className="home-bottom-cta">
          <p className="home-bottom-kicker" id="home-bottom-heading">
            Love game-based learning?
          </p>
          <p className="home-bottom-body">{LOL_PITCH_BANNER_BODY}</p>
          <div className="home-bottom-actions">
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
              className="home-bottom-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              Learn more
            </Link>
          </div>
        </div>

        <p className="home-bottom-safety">
          <span className="home-bottom-safety-icon" aria-hidden>
            🛡️
          </span>
          <span>
            <strong>Classroom-safe by default.</strong> Every caption — curated
            or customized — passes a K-8 brand check before download.
          </span>
        </p>

        <footer className="home-bottom-footer">
          <span>A fun project by </span>
          <span className="home-bottom-footer-brand">Legends of Learning</span>
        </footer>
      </div>
    </section>
  );
}
