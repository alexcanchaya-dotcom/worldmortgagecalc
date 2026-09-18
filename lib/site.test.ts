import assert from "node:assert/strict";
import test from "node:test";
import { siteUrl } from "./site.ts";

test("canonical site URL matches live www host", () => {
  assert.equal(siteUrl, "https://www.worldmortgagecalc.com");
  assert.doesNotMatch(siteUrl, /^https:\/\/worldmortgagecalc\.com\/?$/);
});
