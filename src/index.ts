import * as ts from 'typescript';

export const transformerFactory: ts.TransformerFactory<ts.Node> = (context) => (bundle) => {
    function visitor(node: ts.Node): ts.Node {
        if (ts.isConditionalExpression(node) && isNullAndUndefinedCompare(node.condition))
            return context.factory.updateConditionalExpression(
                node,
                context.factory.updateBinaryExpression(
                    node.condition.left,
                    ts.visitEachChild(node.condition.left.left, visitor, context),
                    node.condition.left.operatorToken.kind === ts.SyntaxKind.EqualsEqualsEqualsToken
                        ? ts.SyntaxKind.EqualsEqualsToken
                        : ts.SyntaxKind.ExclamationEqualsToken,
                    node.condition.left.right,
                ),
                node.questionToken,
                ts.visitNode(node.whenTrue, visitor),
                node.colonToken,
                ts.visitNode(node.whenFalse, visitor),
            );
        return ts.visitEachChild(node, visitor, context);
    }
    if (context.getCompilerOptions().target! >= ts.ScriptTarget.ES2020)
        return bundle; // no need to transform if optional chaining and nullish coalescing are already supported
    return ts.visitNode(bundle, visitor);
};

function isNullAndUndefinedCompare(node: ts.Node): node is ts.BinaryExpression & {left: ts.BinaryExpression} {
    return ts.isBinaryExpression(node) &&
        (node.operatorToken.kind === ts.SyntaxKind.BarBarToken || node.operatorToken.kind === ts.SyntaxKind.AmpersandAmpersandToken) &&
        ts.isBinaryExpression(node.left) &&
        node.left.operatorToken.kind === (
            node.operatorToken.kind === ts.SyntaxKind.BarBarToken
                ? ts.SyntaxKind.EqualsEqualsEqualsToken
                : ts.SyntaxKind.ExclamationEqualsEqualsToken
        ) &&
        node.left.right.kind === ts.SyntaxKind.NullKeyword &&
        ts.isBinaryExpression(node.right) &&
        node.right.operatorToken.kind === node.left.operatorToken.kind &&
        isVoidZero(node.right.right) &&
        ts.isIdentifier(node.right.left) &&
        extractVariable(node.left.left)?.escapedText === node.right.left.escapedText;
}

function extractVariable(node: ts.Expression): ts.Identifier | undefined {
    if (
        ts.isParenthesizedExpression(node) &&
        ts.isBinaryExpression(node.expression) &&
        node.expression.operatorToken.kind === ts.SyntaxKind.EqualsToken
    )
        node = node.expression.left;
    return ts.isIdentifier(node) ? node : undefined;
}

function isVoidZero(node: ts.Node) {
    return ts.isVoidExpression(node) && ts.isNumericLiteral(node.expression) && node.expression.text === '0';
}

export default function(context: ts.TransformationContext): ts.Transformer<ts.Node>;
export default function(program: ts.Program, config?: Record<string, unknown>): ts.TransformerFactory<ts.Node>;
export default function(programOrContext: ts.Program | ts.TransformationContext) {
    if ('readEmitHelpers' in programOrContext)
        return transformerFactory(programOrContext);
    return transformerFactory;
}
