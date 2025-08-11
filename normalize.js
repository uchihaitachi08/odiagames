// Normalize:
// - decode HTML entities (e.g., &#28397;)
// - decode \uXXXX sequences if pasted
// - trim & collapse whitespace
// - NFC normalization
// - strip zero-width chars (ZWJ, ZWNJ, ZWS)
export function normalizeInput(input) {
  let s = String(input);

  // decode HTML entities using a DOM trick
  if (/[&][#\w]+;/.test(s)) {
    const txt = document.createElement('textarea');
    txt.innerHTML = s;
    s = txt.value;
  }

  // decode \uXXXX escapes if user pasted them
  if (/\\u[0-9a-fA-F]{4}/.test(s)) {
    try {
      s = JSON.parse('"' + s.replace(/"/g, '\\"') + '"');
    } catch { /* ignore */ }
  }

  // trim and collapse internal spaces
  s = s.trim().replace(/\s+/g, ' ');

  // remove zero-width characters that sometimes sneak in
  s = s.replace(/[\u200B\u200C\u200D\u2060]/g, '');

  // NFC normalize (precomposed form)
  if (s.normalize) s = s.normalize('NFC');

  return s;
}

// Odia block: U+0B00–U+0B7F
export function isOdiaWord(s) {
  if (!s) return false;
  // allow combining marks with at least one Odia base
  return /[\u0B00-\u0B7F]/.test(s);
}

