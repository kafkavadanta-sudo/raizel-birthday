/* Tiny encoder/decoder for the gift codes.
   Light obfuscation only (it's a gift, not a vault): codes are stored as a hash,
   and each gift's text is scrambled with its own code, so neither is readable
   by just opening the source. Used by app.js and tools/gift-encoder.html. */
(function (root) {
  function normalize(code) {
    return String(code || "").normalize("NFKC").trim().toUpperCase().replace(/\s+/g, "");
  }

  // cyrb53 — small, fast, non-cryptographic string hash
  function hash(str) {
    var h1 = 0xdeadbeef, h2 = 0x41c6ce57;
    for (var i = 0; i < str.length; i++) {
      var ch = str.charCodeAt(i);
      h1 = Math.imul(h1 ^ ch, 2654435761);
      h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
    return (h2 >>> 0).toString(16).padStart(8, "0") + (h1 >>> 0).toString(16).padStart(8, "0");
  }

  function keyFor(code) {
    return hash("rz:" + normalize(code));
  }

  function scramble(bytes, code) {
    var k = new TextEncoder().encode(normalize(code) + "♥");
    var out = new Uint8Array(bytes.length);
    for (var i = 0; i < bytes.length; i++) out[i] = bytes[i] ^ ((k[i % k.length] + i * 31) & 255);
    return out;
  }

  function toB64(bytes) {
    var s = "";
    for (var i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]);
    return btoa(s);
  }

  function fromB64(b64) {
    var s = atob(b64), out = new Uint8Array(s.length);
    for (var i = 0; i < s.length; i++) out[i] = s.charCodeAt(i);
    return out;
  }

  // gift = { name, story, emoji } → [key, data]
  function encode(code, gift) {
    var bytes = new TextEncoder().encode(JSON.stringify(gift));
    return [keyFor(code), toB64(scramble(bytes, code))];
  }

  // → gift object, or null if the code doesn't match any entry
  function decode(code, entries) {
    var key = keyFor(code);
    for (var i = 0; i < (entries || []).length; i++) {
      if (entries[i][0] !== key) continue;
      try {
        return JSON.parse(new TextDecoder().decode(scramble(fromB64(entries[i][1]), code)));
      } catch (e) {
        return null;
      }
    }
    return null;
  }

  root.GiftCodec = { normalize: normalize, encode: encode, decode: decode };
})(typeof window !== "undefined" ? window : globalThis);
