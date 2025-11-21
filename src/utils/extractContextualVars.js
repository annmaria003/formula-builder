export default function extractContextualVars(expression) {
  // returns array of placeholder names without #, e.g. 'num_of_days'
  const rx = /\{\{\s*#([A-Za-z_][A-Za-z0-9_]*)\s*\}\}/g;
  const set = new Set();
  let m;
  while ((m = rx.exec(expression)) !== null) set.add(m[1]);
  return Array.from(set);
}
