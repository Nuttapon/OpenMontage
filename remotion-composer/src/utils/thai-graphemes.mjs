export function segmentGraphemes(text) {
  if (typeof Intl !== "undefined" && "Segmenter" in Intl) {
    const segmenter = new Intl.Segmenter("th", { granularity: "grapheme" });
    return Array.from(segmenter.segment(text), (part) => part.segment);
  }

  return Array.from(text);
}
