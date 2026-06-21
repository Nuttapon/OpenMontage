import assert from "node:assert/strict";
import test from "node:test";

import { segmentGraphemes } from "../src/utils/thai-graphemes.mjs";

test("keeps Thai combining marks attached to their base character", () => {
  const graphemes = segmentGraphemes("ตื่น");

  assert.equal(graphemes.join(""), "ตื่น");
  assert.equal(graphemes.length, 2);
  assert.equal(graphemes[0], "ตื่");
});
