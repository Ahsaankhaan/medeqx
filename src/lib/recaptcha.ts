const SECRET = process.env.RECAPTCHA_SECRET_KEY;

// Hard cap on how long we'll wait for Google. Without this, a slow/unreachable
// Google response makes the request hang forever — under spam-POST load those
// hung requests pile up and can exhaust the server's process/connection limits
// (this was the cause of the site going unresponsive).
const TIMEOUT_MS = 5000;

/**
 * Verify a Google reCAPTCHA v2 token server-side — safely.
 *
 * Behaviour:
 *  - No secret configured  → skip (returns true).
 *  - Empty/missing token   → reject immediately, no network call (stops dumb bots cheaply).
 *  - Real token            → verify with Google, but abort after 5s.
 *  - Google times out/errors (outage) → FAIL-OPEN (returns true) so Google's
 *    availability can never hang our requests or take the site down. Normal bot
 *    rejections still come back fast from Google as success:false and are blocked.
 */
export async function verifyRecaptcha(token: unknown): Promise<boolean> {
  if (!SECRET) return true;
  if (typeof token !== 'string' || token.length === 0) return false;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ secret: SECRET, response: token }).toString(),
      signal: controller.signal,
    });
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch {
    // Timeout or network error talking to Google — never hang or hard-fail here.
    return true;
  } finally {
    clearTimeout(timer);
  }
}
