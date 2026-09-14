










interface NumberToken {
    type: "number",
    value: string
}

interface OperatorToken {
    type: "operator",
    value: Operator
}

interface ParenthesisToken {
    type: "parenthesis";
    value: "(" | ")";
}


type Operator = "*" | "-" | "+" | "/";
type Token = NumberToken | OperatorToken | ParenthesisToken


function Tokenizer(term: string): Token[] {
    const tokens: Token[] = []
    let pervToken: Token | null = null;
    for (let index = 0; index < term.length; index++) {

        const char = term[index]

        if (char != undefined) {
            if (parseInt(char) <= 9) {

                if (pervToken == null && char != undefined) {
                    pervToken = { type: "number", value: char }
                } else if (pervToken != null && pervToken.type === "number") {

                    pervToken.value += char
                } else if (pervToken != null) {

                    tokens.push(pervToken)
                    pervToken = null
                }
            }
            else if (
                char === "+" ||
                char === "-" ||
                char === "*" ||
                char === "/"
            ) {

                if (pervToken != null) {
                    tokens.push(pervToken)
                    pervToken = null
                }
                if (tokens.length === 0) {
                     throw new Error("Undefined expression") 
                    }

                const lastToken = tokens[tokens.length - 1]

                if (
                    lastToken == null ||
                    lastToken.type === "operator" ||
                    (
                        lastToken.type === "parenthesis" &&
                        lastToken.value === "("
                    )
                ) {
                    throw new Error("Undefined expression")
                }

                tokens.push({
                    type: "operator",
                    value: char
                })

            }

            else if (char === "(" || char === ")") {

                tokens.push({
                    type: "parenthesis",
                    value: char,
                });
            }
            else {

                throw new Error(`Undefind character ${char}`);

            }

        }

    }
    if (pervToken != null) {
        tokens.push(pervToken)
    }
    console.log(`HI ${tokens}`)
    for (let i = 0; i < tokens.length; i++)
        console.log(`${tokens[i]?.value}=> ${tokens[i]?.type}`)
    return tokens
}
Tokenizer("8++9")





