import evaluateExpression from "./evaluateExpression.js";

/**
 * variables: array of {name, type, expr}
 * Returns an object {resolved: Map(name->number), errors: []}
 * Throws on circular dependency or undefined var usage.
 */
export default function resolveVariables(variables) {
  const map = new Map();
  for (const v of variables) map.set(v.name, { ...v });

  const resolved = new Map();
  const visiting = new Set();

  function resolve(name) {
    if (resolved.has(name)) return resolved.get(name);
    if (!map.has(name)) throw new Error(`Variable ${name} is not defined.`);
    if (visiting.has(name)) throw new Error(`Circular dependency detected at ${name}.`);
    visiting.add(name);
    const v = map.get(name);
    if (v.type === "CONSTANT") {
      const num = Number(v.expr);
      if (Number.isNaN(num)) throw new Error(`Constant ${name} has non-numeric value.`);
      resolved.set(name, num);
      visiting.delete(name);
      return num;
    } else {
      // DYNAMIC: replace occurrences of variable names (uppercase identifiers) in expression with resolved numbers
      // Build tokenized expression by replacing variable names with their values
      // Allowed variable name pattern: uppercase letters / numbers / underscore
      // We'll replace whole identifiers only.
      let expr = v.expr;
      // find identifiers by regex
      const idRx = /\b[A-Z_][A-Z0-9_]*\b/g;
      expr = expr.replace(idRx, (id) => {
        // id may refer to other variable
        const val = resolve(id); // recursive
        return String(val);
      });
      // Now expr contains only numbers, operators and parentheses
      const result = evaluateExpression(expr);
      resolved.set(name, result);
      visiting.delete(name);
      return result;
    }
  }

  // attempt to resolve all
  for (const name of map.keys()) {
    if (!resolved.has(name)) resolve(name);
  }
  return resolved; // Map of name -> numeric value
}
