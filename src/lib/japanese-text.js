/**
 * Replaces annotated Japanese text with its kana reading for deterministic TTS.
 * Longer keys win so entries such as "日本語" are handled before "日本".
 */
export function toKanaReading(text, rubyMap = {}) {
  if (!text || !rubyMap || typeof rubyMap !== 'object') return text;

  const keys = Object.keys(rubyMap)
    .filter(key => key && typeof rubyMap[key] === 'string' && rubyMap[key])
    .sort((a, b) => b.length - a.length);

  if (keys.length === 0) return text;

  const pattern = new RegExp(keys.map(escapeRegExp).join('|'), 'g');
  return text.replace(pattern, match => rubyMap[match]);
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
