const ignorePatterns = [
  /```[\s\S]*?```/g,   // Code blocks
  /`[^`]*`/g,          // Inline code
  /!\[.*?\]\(.*?\)/g,  // Images
  /\[.*?\]\(.*?\)/g,   // Links
  /<([a-zA-Z0-9]+)[^>]*>[\s\S]*?<\/\1>/g,  // HTML tags
  /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g, // Emails
  /\+?(\d{1,2}\s?)?(\(?\d{3}\)?[\s\-]?)?[\d\-]{7,}/g // Phone numbers
];

type Callback = (param: { word: string, start: number, end: number }) => void

export function processMarkdownWords(text: string, callback: Callback) {
  const excludedRanges: { start: number; end: number }[] = [];

  ignorePatterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      excludedRanges.push({
        start: match.index,
        end: match.index + match[0].length
      });
    }
  });

  excludedRanges.sort((a, b) => a.start - b.start);

  function isInExcludedRange(start: number, end: number) {
    return excludedRanges.some(range => start >= range.start && end <= range.end);
  }

  const wordPattern = /\b\w+\b/g;
  let match;
  while ((match = wordPattern.exec(text)) !== null) {
    const word = match[0];
    const start = match.index;
    const end = start + word.length;

    if (isInExcludedRange(start, end)) {
      continue;
    }

    callback({ word, start, end })
  }
}
