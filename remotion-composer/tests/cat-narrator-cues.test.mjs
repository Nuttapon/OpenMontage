import assert from "node:assert/strict";
import test from "node:test";

import { resolveMascotCues } from "../src/components/cat-narrator-cues.mjs";

test("replaces an adjacent duplicate expression", () => {
  const cues = resolveMascotCues([
    { inSeconds: 0, outSeconds: 2, expression: "curious" },
    { inSeconds: 2, outSeconds: 4, expression: "curious" },
  ]);

  assert.equal(cues[1].expression, "interested");
});

test("never leaves duplicates adjacent after a fallback", () => {
  const cues = resolveMascotCues([
    { inSeconds: 0, outSeconds: 2, expression: "curious" },
    { inSeconds: 2, outSeconds: 4, expression: "curious" },
    { inSeconds: 4, outSeconds: 6, expression: "interested" },
  ]);

  assert.notEqual(cues[1].expression, cues[0].expression);
  assert.notEqual(cues[2].expression, cues[1].expression);
});

test("uses the channel default cue when none are supplied", () => {
  const cues = resolveMascotCues();

  assert.deepEqual(cues, [
    { inSeconds: 0, outSeconds: 2.4, expression: "interested", position: "right", entrance: "pop" },
  ]);
});
