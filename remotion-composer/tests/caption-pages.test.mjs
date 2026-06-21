import assert from "node:assert/strict";
import test from "node:test";

import { buildCaptionPages } from "../src/utils/caption-pages.mjs";

test("keeps phrase captions on separate pages when configured for one phrase", () => {
  const pages = buildCaptionPages([
    { word: "กาแฟแก้วแรก", startMs: 0, endMs: 1200 },
    { word: "ไม่ใช่เวลาที่ดีที่สุด", startMs: 1300, endMs: 2600 },
  ], 1);

  assert.equal(pages.length, 2);
  assert.equal(pages[0].words[0].word, "กาแฟแก้วแรก");
  assert.equal(pages[1].words[0].word, "ไม่ใช่เวลาที่ดีที่สุด");
});
