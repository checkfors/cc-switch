import { describe, it, expect } from "vitest";
import { isValidHeaderName, isValidHeaderValue } from "@/lib/httpHeaders";

// Control chars for testing — matching the pattern in userAgent.test.ts
const NUL = String.fromCharCode(0);
const DEL = String.fromCharCode(0x7f);

describe("isValidHeaderName", () => {
  it("rejects empty / whitespace-only", () => {
    expect(isValidHeaderName("")).toBe(false);
    expect(isValidHeaderName("   ")).toBe(false);
  });

  it("accepts valid token chars (RFC 7230)", () => {
    expect(isValidHeaderName("Content-Type")).toBe(true);
    expect(isValidHeaderName("X-Custom-Header")).toBe(true);
    expect(isValidHeaderName("x-api-key")).toBe(true);
    expect(isValidHeaderName("Authorization")).toBe(true);
  });

  it("trims surrounding whitespace before validating", () => {
    expect(isValidHeaderName("  Content-Type  ")).toBe(true);
  });

  it("accepts single-token names", () => {
    expect(isValidHeaderName("Host")).toBe(true);
    expect(isValidHeaderName("accept")).toBe(true);
  });

  it("rejects names with spaces", () => {
    expect(isValidHeaderName("Content Type")).toBe(false);
  });

  it("rejects names with control characters", () => {
    expect(isValidHeaderName(`X${NUL}Header`)).toBe(false);
    expect(isValidHeaderName(`X\nHeader`)).toBe(false);
    expect(isValidHeaderName(`X${DEL}Header`)).toBe(false);
  });

  it("rejects names with non-token chars (colons, equals, etc)", () => {
    expect(isValidHeaderName("Content:Type")).toBe(false);
    expect(isValidHeaderName("X=Y")).toBe(false);
  });
});

describe("isValidHeaderValue", () => {
  it("rejects empty / whitespace-only", () => {
    expect(isValidHeaderValue("")).toBe(false);
    expect(isValidHeaderValue("   ")).toBe(false);
  });

  it("accepts visible ASCII", () => {
    expect(isValidHeaderValue("application/json")).toBe(true);
    expect(isValidHeaderValue("Bearer my-token-123")).toBe(true);
  });

  it("accepts non-ASCII (matches backend HeaderValue byte rule)", () => {
    expect(isValidHeaderValue("Bearer 令牌")).toBe(true);
  });

  it("accepts internal tab", () => {
    expect(isValidHeaderValue("value\twith\ttab")).toBe(true);
  });

  it("trims surrounding whitespace", () => {
    expect(isValidHeaderValue("  Bearer token  ")).toBe(true);
  });

  it("rejects control characters (newline / null / DEL)", () => {
    expect(isValidHeaderValue("value\ninjection")).toBe(false);
    expect(isValidHeaderValue(`value${NUL}injection`)).toBe(false);
    expect(isValidHeaderValue(`value${DEL}injection`)).toBe(false);
  });
});
