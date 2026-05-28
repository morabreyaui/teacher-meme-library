/** OpenAI key present — required for full safety review on save. */
export function hasOpenAIKey() {
  return Boolean(process.env.OPENAI_API_KEY?.trim());
}

/**
 * On save/render: block when moderation was skipped but we expect the API to work.
 * Production + API key configured => never ship without a successful moderation call.
 */
export function failClosedOnModerationSkip() {
  if (process.env.REQUIRE_MODERATION_API === "true") return true;
  return process.env.NODE_ENV === "production" && hasOpenAIKey();
}

/** Production deploys must have OPENAI_API_KEY so every save gets reviewed. */
export function saveBlockedWithoutApi() {
  return process.env.NODE_ENV === "production" && !hasOpenAIKey();
}

export const MODERATION_UNAVAILABLE_MESSAGE =
  "Safety review is temporarily unavailable. Please try again in a few minutes.";

export const MODERATION_NOT_CONFIGURED_MESSAGE =
  "Safety review isn't set up on this site yet. The team needs to add an OpenAI API key in Vercel.";
