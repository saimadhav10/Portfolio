import test from "node:test";
import assert from "node:assert/strict";
import { validateContact } from "../src/lib/contact";
test("validates and trims a genuine enquiry", () => {
  assert.deepEqual(
    validateContact({
      name: " Sai ",
      email: " visitor@example.com ",
      message: " A collaboration idea. ",
    }),
    {
      name: "Sai",
      email: "visitor@example.com",
      message: "A collaboration idea.",
      website: "",
    },
  );
});
test("rejects missing fields, header injection, invalid addresses, and oversized messages", () => {
  const good = {
    name: "Visitor",
    email: "visitor@example.com",
    message: "A collaboration idea.",
  };
  for (const bad of [
    null,
    {},
    { ...good, name: "A\nB" },
    { ...good, email: "invalid" },
    { ...good, message: "short" },
    { ...good, message: "a".repeat(5001) },
    { ...good, name: 45 },
  ])
    assert.equal(validateContact(bad), null);
});
test("retains honeypot value for server-side filtering", () => {
  assert.equal(
    validateContact({
      name: "Bot",
      email: "bot@example.com",
      message: "A spam message.",
      website: "https://spam.example",
    })?.website,
    "https://spam.example",
  );
});
