import Link from "next/link";
import { LOL_ABOUT_URL, LOL_SIGNUP_URL } from "../lib/share-links";
import { LOL_PITCH_SHORT } from "../lib/lol-copy";

/** Compact signup line for modals, footers, and mid-journey touchpoints. */
export default function LolSignupStrip({ className = "" }) {
  return (
    <p className={`lol-signup-strip ${className}`.trim()}>
      {LOL_PITCH_SHORT}{" "}
      <Link href={LOL_SIGNUP_URL} target="_blank" rel="noopener noreferrer">
        Sign up free
      </Link>
      {" · "}
      <Link href={LOL_ABOUT_URL} target="_blank" rel="noopener noreferrer">
        About Legends
      </Link>
    </p>
  );
}
