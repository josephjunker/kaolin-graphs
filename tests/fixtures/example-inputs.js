
import {createScope, core as c} from "schema-combinators";

const scope = createScope();

const identifier = scope.newType("Identifier", c.string());

const number = scope.newType("Number", c.strictStruct({
  type: c.literal("Number"),
  value: c.number()
}));

const string = scope.newType("String", c.strictStruct({
  type: c.literal("String"),
  value: c.string()
}));

const keyword = scope.newType("Keyword", c.strictStruct({
  type: c.literal("Keyword"),
  value: c.string()
}));

const dictionary = scope.newType("Dictionary", c.strictStruct({
  type: c.literal("Dictionary"),
  value: c.array(c.strictStruct({
    key: c.reference("Expression"),
    value: c.reference("Expression")
  }))
}));

const literal = scope.newType("Literal", c.strictStruct({
  type: c.literal("Literal"),
  value: c.alternatives(number, string, keyword, dictionary)
}));

const dictionaryAccess = scope.newType("DictionaryAccess", c.strictStruct({
  type: c.literal("DictionaryAccess"),
  identifier: identifier,
  accessPath: c.array(c.string())
}));

const dictionaryAssignmentStatement = scope.newType("DictionaryAssignmentStatement", c.strictStruct({
  type: c.literal("DictionaryAssignmentStatement"),
  identifier: identifier,
  assignmentPath: c.array(c.string()),
  value: c.reference("Expression")
}));

const conditional = scope.newType("Conditional", c.strictStruct({
  type: c.literal("Conditional"),
  interrogee: c.reference("Expression"),
  trueBranch: c.alternatives(c.reference("Expression"), c.reference("BlockStatement")),
  falseBranch: c.alternatives(c.reference("Expression"), c.reference("BlockStatement"))
}));

const expression = scope.newType("Expression", c.alternatives(
  literal,
  identifier,
  dictionaryAccess,
  conditional,
  c.reference("FunctionInvocation")));

const variableDeclaration = scope.newType("VariableDeclaration", c.strictStruct({
  type: c.literal("VariableDeclaration"),
  identifier: identifier
}));

const assignmentStatement = scope.newType("AssignmentStatement", c.strictStruct({
  type: c.literal("AssignmentStatement"),
  identifier: identifier,
  value: expression
}));

const functionInvocation = scope.newType("FunctionInvocation", c.strictStruct({
  type: c.literal("FunctionInvocation"),
  functionIdentifier: identifier,
  arguments: c.array(expression)
}));

const functionDeclaration = scope.newType("FunctionDeclaration", c.strictStruct({
  type: c.literal("FunctionDeclaration"),
  functionIdentifier: identifier,
  body: c.reference("BlockStatement")
}));

const importStatement = scope.newType("ImportStatement", c.strictStruct({
  type: c.literal("ImportStatement"),
  importedNamespace: c.string(),
  bindings: c.dictionary(identifier, identifier)
}));

const block = scope.newType("BlockStatement", c.strictStruct({
  type: c.literal("BlockStatement"),
  body: c.array(c.reference("Node"))
}));

const returnStatement = scope.newType("ReturnStatement", c.strictStruct({
  type: c.literal("ReturnStatement"),
  body: c.optional(expression)
}));

const statement = scope.newType("Statement", c.strictStruct({
  type: c.literal("Statement"),
  body: c.alternatives(
    variableDeclaration,
    assignmentStatement,
    dictionaryAssignmentStatement,
    functionInvocation,
    functionDeclaration,
    importStatement,
    conditional,
    returnStatement)
}));

const node = scope.newType("Node", c.alternatives(block, statement));

scope.newType("AST", node);

export default scope;

