export function buildCaptionPages(words, wordsPerPage) {
  const pages = [];

  for (let index = 0; index < words.length; index += wordsPerPage) {
    const pageWords = words.slice(index, index + wordsPerPage);
    if (pageWords.length === 0) continue;

    pages.push({
      words: pageWords,
      startMs: pageWords[0].startMs,
      endMs: pageWords[pageWords.length - 1].endMs,
    });
  }

  return pages;
}
