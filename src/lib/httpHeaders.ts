/**
 * Validate HTTP header name.
 *
 * Per RFC 7230 §3.2, header names are tokens: printable ASCII excluding
 * delimiters. Must not be empty. Must not contain control characters.
 *
 * Matches `http::HeaderName::from_str()` in Rust.
 */
export function isValidHeaderName(value: string): boolean {
  const trimmed = value.trim();
  if (trimmed === "") return false;
  // Token chars per RFC 7230: !#$%&'*+-.^_`|~ plus alphanumeric
  return /^[!#$%&'*+\-.^_`|~0-9a-zA-Z]+$/.test(trimmed);
}

/**
 * Validate HTTP header value.
 *
 * Valid bytes are: b >= 32 && b != 127 || b == '\t'.
 * This matches `http::HeaderValue::from_str()` in Rust — same as
 * `isValidUserAgentHeader` in userAgent.ts but rejects empty string
 * (a header with no value is meaningless).
 *
 * Empty/whitespace-only returns false.
 */
export function isValidHeaderValue(value: string): boolean {
  const trimmed = value.trim();
  if (trimmed === "") return false;
  // eslint-disable-next-line no-control-regex
  return !/[\x00-\x08\x0a-\x1f\x7f]/.test(trimmed);
}
