"use strict";
// type Operator = "+" | "-" | "*" | "/";
Object.defineProperty(exports, "__esModule", { value: true });
// =========================
// TOKENIZER
// =========================
function tokenize(expression) {
    const tokens = [];
    function readNumber(index, value) {
        const character = expression.charAt(index);
        if (character >= "0" && character <= "9") {
            return readNumber(index + 1, value + character);
        }
        return index;
    }
    function readToken(index) {
        if (index >= expression.length) {
            return;
        }
        const character = expression.charAt(index);
        // Space
        if (character === " ") {
            readToken(index + 1);
            return;
        }
        // Number
        if (character >= "0" && character <= "9") {
            const endIndex = readNumber(index, "");
            const numberValue = Number(expression.slice(index, endIndex));
            tokens.push({
                type: "number",
                value: numberValue,
            });
            readToken(endIndex);
            return;
        }
        // Operator
        if (character === "+" ||
            character === "-" ||
            character === "*" ||
            character === "/") {
            tokens.push({
                type: "operator",
                value: character,
            });
            readToken(index + 1);
            return;
        }
        // Parentheses
        if (character === "(" || character === ")") {
            tokens.push({
                type: "parenthesis",
                value: character,
            });
            readToken(index + 1);
            return;
        }
        throw new Error(`Invalid character: ${character}`);
    }
    readToken(0);
    return tokens;
}
// =========================
// PARSER
// =========================
function parse(tokens) {
    let currentIndex = 0;
    function currentToken() {
        return tokens[currentIndex];
    }
    function parseExpression() {
        let left = parseTerm();
        function continueExpression() {
            const token = currentToken();
            if (token &&
                token.type === "operator" &&
                (token.value === "+" || token.value === "-")) {
                currentIndex++;
                const right = parseTerm();
                left = {
                    type: "binary",
                    operator: token.value,
                    left,
                    right,
                };
                return continueExpression();
            }
            return left;
        }
        return continueExpression();
    }
    function parseTerm() {
        let left = parseFactor();
        function continueTerm() {
            const token = currentToken();
            if (token &&
                token.type === "operator" &&
                (token.value === "*" || token.value === "/")) {
                currentIndex++;
                const right = parseFactor();
                left = {
                    type: "binary",
                    operator: token.value,
                    left,
                    right,
                };
                return continueTerm();
            }
            return left;
        }
        return continueTerm();
    }
    function parseFactor() {
        const token = currentToken();
        if (!token) {
            throw new Error("Expression is incomplete.");
        }
        // Number
        if (token.type === "number") {
            currentIndex++;
            return {
                type: "number",
                value: token.value,
            };
        }
        // Parentheses
        if (token.type === "parenthesis" &&
            token.value === "(") {
            currentIndex++;
            const node = parseExpression();
            const closingToken = currentToken();
            if (!closingToken ||
                closingToken.type !== "parenthesis" ||
                closingToken.value !== ")") {
                throw new Error("Missing closing parenthesis.");
            }
            currentIndex++;
            return node;
        }
        throw new Error("Invalid expression.");
    }
    const tree = parseExpression();
    if (currentIndex < tokens.length) {
        throw new Error("Invalid expression.");
    }
    return tree;
}
// =========================
// EVALUATOR
// =========================
function evaluate(node) {
    if (node.type === "number") {
        return node.value;
    }
    const left = evaluate(node.left);
    const right = evaluate(node.right);
    switch (node.operator) {
        case "+":
            return left + right;
        case "-":
            return left - right;
        case "*":
            return left * right;
        case "/":
            if (right === 0) {
                throw new Error("Cannot divide by zero.");
            }
            return left / right;
    }
}
// =========================
// CALCULATOR
// =========================
function calculate(expression) {
    const tokens = tokenize(expression);
    const tree = parse(tokens);
    return evaluate(tree);
}
// =========================
// TEST
// =========================
const expression = "3 + 99 * 12 - 4";
const result = calculate(expression);
console.log("Expression:", expression);
console.log("Result:", result);
//# sourceMappingURL=index.js.map