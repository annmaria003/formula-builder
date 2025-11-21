// Simple shunting-yard / RPN evaluator supporting + - * / and parentheses.
// Returns numeric value or throws an Error with a descriptive message.

function isNumberToken(t) {
  return /^-?\d+(\.\d+)?$/.test(t);
}
function precedence(op) {
  if (op === "+" || op === "-") return 1;
  if (op === "*" || op === "/") return 2;
  return 0;
}

export default function evaluateExpression(expr) {
  // Validate characters (numbers, operators, spaces, parentheses, decimal point)
  if (!/^[0-9+\-*/().\s]+$/.test(expr)) {
    throw new Error("Expression contains invalid characters.");
  }

  // Tokenize (numbers and operators/parentheses)
  const tokens = [];
  let numBuf = "";
  for (let i = 0; i < expr.length; i++) {
    const ch = expr[i];
    if ("0123456789.".includes(ch)) {
      numBuf += ch;
    } else if (ch === " " || ch === "\t") {
      if (numBuf) { tokens.push(numBuf); numBuf = ""; }
    } else if ("+-*/()".includes(ch)) {
      if (numBuf) { tokens.push(numBuf); numBuf = ""; }
      tokens.push(ch);
    } else {
      // should not happen due to validation, but guard anyway
      throw new Error("Invalid character in expression.");
    }
  }
  if (numBuf) tokens.push(numBuf);

  // Shunting-yard to RPN
  const out = [];
  const ops = [];
  for (let t of tokens) {
    if (isNumberToken(t)) {
      out.push(t);
    } else if ("+-*/".includes(t)) {
      while (ops.length && "()+-*/".includes(ops[ops.length-1]) && precedence(ops[ops.length-1]) >= precedence(t)) {
        out.push(ops.pop());
      }
      ops.push(t);
    } else if (t === "(") {
      ops.push(t);
    } else if (t === ")") {
      while (ops.length && ops[ops.length-1] !== "(") out.push(ops.pop());
      if (!ops.length || ops.pop() !== "(") throw new Error("Mismatched parentheses.");
    } else {
      throw new Error("Unknown token: " + t);
    }
  }
  while (ops.length) {
    const op = ops.pop();
    if (op === "(" || op === ")") throw new Error("Mismatched parentheses.");
    out.push(op);
  }

  // Evaluate RPN
  const stack = [];
  for (let t of out) {
    if (isNumberToken(t)) {
      stack.push(Number(t));
    } else if ("+-*/".includes(t)) {
      if (stack.length < 2) throw new Error("Invalid expression.");
      const b = stack.pop(), a = stack.pop();
      if (t === "+") stack.push(a + b);
      if (t === "-") stack.push(a - b);
      if (t === "*") stack.push(a * b);
      if (t === "/") {
        if (b === 0) throw new Error("Division by zero.");
        stack.push(a / b);
      }
    } else {
      throw new Error("Unexpected token in RPN: " + t);
    }
  }
  if (stack.length !== 1) throw new Error("Invalid expression evaluation.");
  return stack[0];
}
