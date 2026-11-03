const test = require("node:test");
const assert = require("node:assert/strict");
const { isValidEmail, isValidPhone, isValidEventPayload } = require("../src/utils/validation");

test("accepts a valid email address", () => {
  assert.equal(isValidEmail("student@example.com"), true);
});

test("rejects an invalid email address", () => {
  assert.equal(isValidEmail("not-an-email"), false);
});

test("accepts a valid 10-digit Indian mobile number", () => {
  assert.equal(isValidPhone("9876543210"), true);
});

test("rejects an invalid mobile number", () => {
  assert.equal(isValidPhone("12345"), false);
});

test("accepts a valid event object", () => {
  assert.equal(isValidEventPayload({ name: "Code Sprint", category: "technical", fee: 100, seats: 20 }), true);
});

test("rejects an event with an unsupported category", () => {
  assert.equal(isValidEventPayload({ name: "Code Sprint", category: "other", fee: 100, seats: 20 }), false);
});
