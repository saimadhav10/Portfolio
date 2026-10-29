import test from "node:test";
import assert from "node:assert/strict";
import { POST } from "../src/app/api/contact/route";
const message = {
  name: "Test visitor",
  email: "visitor@example.com",
  message: "I would like to collaborate.",
};
function request(body: unknown, origin = "https://portfolio.example") {
  return new Request("https://portfolio.example/api/contact", {
    method: "POST",
    headers: { "content-type": "application/json", origin },
    body: JSON.stringify(body),
  });
}
test("rejects cross-origin submissions and malformed messages", async () => {
  assert.equal(
    (await POST(request(message, "https://other.example"))).status,
    403,
  );
  assert.equal((await POST(request({}))).status, 400);
});
test("filters honeypot submissions", async () => {
  assert.equal(
    (await POST(request({ ...message, website: "spam" }))).status,
    200,
  );
});
test("reports configuration errors and mocked provider outcomes honestly", async () => {
  const names = [
    "RESEND_API_KEY",
    "CONTACT_TO_EMAIL",
    "CONTACT_FROM_EMAIL",
  ] as const;
  const previous = names.map((name) => process.env[name]);
  const originalFetch = globalThis.fetch;
  try {
    names.forEach((name) => delete process.env[name]);
    assert.equal((await POST(request(message))).status, 503);
    process.env.RESEND_API_KEY = "test-only-not-a-real-key";
    process.env.CONTACT_TO_EMAIL = "owner@example.com";
    process.env.CONTACT_FROM_EMAIL = "Portfolio <hello@example.com>";
    globalThis.fetch = async (_url, init) => {
      const body = JSON.parse(String(init?.body));
      assert.deepEqual(body.to, ["owner@example.com"]);
      assert.equal(body.reply_to, message.email);
      assert.equal(body.text.includes(message.message), true);
      return Response.json({ id: "mock-message" });
    };
    assert.equal((await POST(request(message))).status, 200);
    globalThis.fetch = async () =>
      Response.json({ error: "unavailable" }, { status: 429 });
    assert.equal((await POST(request(message))).status, 502);
    globalThis.fetch = async () => {
      throw new Error("timeout");
    };
    assert.equal((await POST(request(message))).status, 502);
  } finally {
    globalThis.fetch = originalFetch;
    names.forEach((name, i) => {
      if (previous[i] === undefined) delete process.env[name];
      else process.env[name] = previous[i];
    });
  }
});
