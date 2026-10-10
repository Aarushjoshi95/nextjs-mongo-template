// Server-only Jev (TypeSafe) client. Jev makes typed decisions (choice / score / yes-no)
// against the Emergent universal key. Never import this from client components.
import { TypeSafeClient } from '@typesafe-ai/sdk';

const proxy = (process.env.INTEGRATION_PROXY_URL || 'https://integrations.emergentagent.com').replace(/\/$/, '');

let _client;
export function getJev() {
  if (!process.env.EMERGENT_LLM_KEY) return null;
  if (!_client) {
    _client = new TypeSafeClient({
      apiKey: process.env.EMERGENT_LLM_KEY,
      baseURL: `${proxy}/llm/typesafe`,
      retry: { maxRetries: 2, respectRetryAfter: false },
    });
  }
  return _client;
}

export const JEV_MODEL = 'jev-latest';

// Most-likely level label for a `score` answer. Keys are zero-based level indices as strings.
export function topLevel(scoreAnswer, levels) {
  const probs = scoreAnswer?.probabilities || {};
  let bestK = null;
  let bestP = -1;
  for (const [k, p] of Object.entries(probs)) {
    if (p > bestP) { bestP = p; bestK = k; }
  }
  const idx = bestK === null ? 0 : Number(bestK);
  return { index: idx, label: levels[idx] ?? levels[0], probability: bestP < 0 ? 0 : bestP };
}
