

type Operator = "+" | "-" | "*" | "/";
//interface => هم مقدار مشخص بشه هم token
interface NumberToken {
    type: "number";
    value: number;
}

interface OperatorToken {
    type: "operator";
    value: Operator;
}
//تعریف پرانتز که باز است یا بسته
interface ParenthesisToken {
    type: "parenthesis";
    value: "(" | ")";
}

type Token = NumberToken | OperatorToken | ParenthesisToken;

// برای اینکه رشته به Token تبدیل بشه
function tokenize(expression: string): Token[] {
    const tokens: Token[] = [];

    function readNumber(index: number, value: string): number {
        //charAt(index) => "10 + 5" , charAt(1) , index=1 => "0"
        const character = expression.charAt(index);

        if (character >= "0" && character <= "9") {
            //exp :"12 + 5" ,index=0 , value="", charAt="1" => readNumber(1,"1")
            return readNumber(index + 1, value + character);
        }

        return index;
    }
    // اگر طول عبارت بزرگتر مساوی index شد تمام کن بررسی رو.
    function readToken(index: number): void {
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

            const numberValue = Number(
                expression.slice(index, endIndex)
            );

            tokens.push({
                type: "number",
                value: numberValue,
            });

            readToken(endIndex);
            return;
        }

        // Operator
        if (
            character === "+" ||
            character === "-" ||
            character === "*" ||
            character === "/"
        ) {
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
//عملیات درختی
interface NumberNode {
    type: "number";
    value: number;
}
//Binary => عملیات دوطرفه5 + 3
interface BinaryNode {
    type: "binary";
    operator: Operator;
    left: CalculationNode;
    right: CalculationNode;
}

type CalculationNode = NumberNode | BinaryNode;

// تجزیه و اولویت  بندی عملیات
function parse(tokens: Token[]): CalculationNode {
    let currentIndex = 0;

    function currentToken(): Token | undefined {
        return tokens[currentIndex];
    }

    function parseExpression(): CalculationNode {
        let left = parseTerm();

        function continueExpression(): CalculationNode {
            const token = currentToken();

            if (
                token &&
                token.type === "operator" &&
                (token.value === "+" || token.value === "-")
            ) {
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

    function parseTerm(): CalculationNode {
        let left = parseFactor();

        function continueTerm(): CalculationNode {
            const token = currentToken();

            if (
                token &&
                token.type === "operator" &&
                (token.value === "*" || token.value === "/")
            ) {
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

    function parseFactor(): CalculationNode {
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
        if (
            token.type === "parenthesis" &&
            token.value === "("
        ) {
            currentIndex++;

            const node = parseExpression();

            const closingToken = currentToken();

            if (
                !closingToken ||
                closingToken.type !== "parenthesis" ||
                closingToken.value !== ")"
            ) {
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


function evaluate(node: CalculationNode): number {
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


function calculate(expression: string): number {
    const tokens = tokenize(expression);
    const tree = parse(tokens);

    return evaluate(tree);
}

const expression = "3 + 99 * 12 - 4";

const result = calculate(expression);

console.log("Expression:", expression);
console.log("Result:", result);





