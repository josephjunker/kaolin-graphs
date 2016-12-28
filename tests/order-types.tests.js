
const orderedTypeScope = require("../lib/ordered-types-schema").default,
      {compileValidators} = require("kaolin"),
      scope = require("./example-inputs"),
      {orderTypes} = require("../lib");

const indexByName = nodes => nodes.reduce((acc, node) => {
  acc[node.name] = node;
  return acc;
}, {});

describe("orderTypes", () => {

  it("should conform to its schema", () => {
    const validators = compileValidators(orderedTypeScope);
    const error = validators.NodeArray(orderTypes(scope, ["AST"]));
    if (error) throw new Error(error);
  });

  it("should include a node's parents in that node's ancestors", () => {
    orderTypes(scope, ["AST"]).forEach(node => {
      node.parents.forEach(parentName => {
        if (!node.ancestors.includes(parentName))
          throw new Error(`Error for node ${node.name} and parent ${parentName}`);
      });
    });
  });

  it("should ensure that each node's ancestors is a superset of its parents ancestors", () => {
    const ordered = orderTypes(scope, ["AST"]),
          indexed = indexByName(ordered);

    ordered.forEach(node => {
      node.parents.forEach(parentName => {
        const parentAncestors = indexed[parentName].ancestors,
              nodeAncestors = node.ancestors;

        parentAncestors.forEach(ancestorName => {
          if (!nodeAncestors.includes(ancestorName))
            throw new Error(`Error for node ${node.name} and parent ${parentName} and ancestor ${ancestorName}`);
        });
      });
    });
  });

  it("should assign nodes a rank that is one greater than the minumum rank of their parents", () => {
    const ordered = orderTypes(scope, ["AST"]),
          indexed = indexByName(ordered);

    ordered.forEach(node => {
      const minimumParentRank = node.parents.reduce((minRank, parentName) => {
        const parentRank = indexed[parentName].rank;

        return minRank < parentRank ? minRank : parentRank;
      }, Infinity);

      if (minimumParentRank === Infinity) return;

      if (minimumParentRank + 1 !== node.rank)
        throw new Error(`Error for node ${node.name}`);
    });
  });

  it("should not put greater ranks before lesser ranks", () => {
    orderTypes(scope, ["AST"]).reduce((previousRank, node) => {
      if (node.rank < previousRank) throw new Error(`Node ${node.name} was out of order`);
      return node.rank;
    }, -1);
  });

  it("when ranks are tied, a node should not precede its ancestors unless it is an ancestor of said ancestor", () => {
    const ordered = orderTypes(scope, ["AST"]);

    ordered.forEach((preceding, firstIndex) => {
      ordered.forEach((following, secondIndex) => {
        if (secondIndex <= firstIndex) return;
        if (preceding.rank !== following.rank) return;

        if (!preceding.ancestors.includes(following.name)) return;

        if (following.ancestors.includes(preceding.name)) return;

        console.dir(preceding);
        console.dir(following);

        throw new Error(`Error for node ${preceding.name} and following node ${following.name}`);
      });
    });
  });
});

