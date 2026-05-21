// Minimal model-agnostic LLM adapter.
//
// Today we hit OpenAI's chat completions endpoint. The agentic
// workflow only ever calls callJSON() / callText() from this file —
// swapping the underlying model (Anthropic, Cursor Agent SDK,
// Claude Code SDK, etc.) means changing one function, not the
// pipeline.

// Default to the full gpt-4.1: the cost diff vs -mini is small for
// short caption / scoring calls, and the humor quality bump is the
// single biggest lever for "actually-funny" output. Override with
// OPENAI_MODEL if you want to A/B a different model.
const DEFAULT_MODEL = "gpt-4.1";
const OPENAI_URL = "https://api.openai.com/v1/chat/completions";

export function llmConfigured() {
  return Boolean(process.env.OPENAI_API_KEY);
}

async function callOpenAI({ system, user, jsonMode, temperature, maxTokens }) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    const err = new Error("LLM is not configured (no API key).");
    err.code = "LLM_NOT_CONFIGURED";
    throw err;
  }

  const model = process.env.OPENAI_MODEL || DEFAULT_MODEL;
  const body = {
    model,
    temperature: temperature ?? 0.9,
    max_tokens: maxTokens ?? 600,
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
  };
  if (jsonMode) {
    body.response_format = { type: "json_object" };
  }

  const res = await fetch(OPENAI_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    const err = new Error(`LLM error ${res.status}: ${text.slice(0, 200)}`);
    err.code = "LLM_HTTP_ERROR";
    err.status = res.status;
    throw err;
  }
  const data = await res.json();
  return data?.choices?.[0]?.message?.content?.trim() || "";
}

/** Call the LLM and require a parsed JSON response. */
export async function callJSON({ system, user, temperature, maxTokens }) {
  const raw = await callOpenAI({
    system,
    user,
    jsonMode: true,
    temperature,
    maxTokens,
  });
  try {
    return JSON.parse(raw);
  } catch (e) {
    const err = new Error(`Could not parse LLM JSON: ${raw.slice(0, 200)}`);
    err.code = "LLM_BAD_JSON";
    throw err;
  }
}

export async function callText({ system, user, temperature, maxTokens }) {
  return callOpenAI({ system, user, jsonMode: false, temperature, maxTokens });
}
