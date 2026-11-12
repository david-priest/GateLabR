// Decode Git's +++ path field; malformed or undecodable fields cannot grant an exemption.
export function addedFilePath(header) {
  const field = header.split("\t", 1)[0];
  let path = field;
  if (field.startsWith('"')) {
    if (!/^"(?:[^"\\]|\\(?:[abfnrtv"\\]|[0-3][0-7]{2}))*"$/.test(field)) return null;
    const escapes = { a: 7, b: 8, f: 12, n: 10, r: 13, t: 9, v: 11, '"': 34, "\\": 92 };
    const bytes = [];
    for (const token of field.slice(1, -1).matchAll(/\\([abfnrtv"\\]|[0-3][0-7]{2})|[^\\]+/g)) {
      bytes.push(token[1]
        ? Buffer.from([/^[0-3]/.test(token[1]) ? parseInt(token[1], 8) : escapes[token[1]]])
        : Buffer.from(token[0], "utf8"));
    }
    try {
      path = new TextDecoder("utf-8", { fatal: true }).decode(Buffer.concat(bytes));
    } catch {
      return null;
    }
  }
  if (!path.startsWith("b/") || path.includes("\uFFFD")) return null;
  return path.slice(2);
}
