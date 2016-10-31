
import {
  merge,
  mapObject,
  union,
  deepEqual,
  iterateUntilStable,
  updateForKey,
  compose
} from "./utils";

const addAncestors = (graph, rootNodes) => {

  const initial = mapObject(
    graph,
    node =>
      merge(node, {
        ancestors: rootNodes.indexOf(node.name) !== -1 ?
          [] :
          node.parents,
        distanceToRoot: rootNodes.indexOf(node.name) !== -1 ?
          0 :
          Infinity
      }));

  return iterateUntilStable(
    initial,
    graph => mapObject(
      graph,
      node =>
        rootNodes.indexOf(node.name) !== -1 ?
          node :
          merge(node, {
            ancestors: union(
              node.ancestors, ...node.ancestors.map(ancestorName => graph[ancestorName].ancestors))
              .sort(), // Stabilize to be sure that we'll converge
            distanceToRoot: node.parents
              .map(parentName => graph[parentName].distanceToRoot + 1)
              .reduce((x, y) => x < y ? x : y, node.distanceToRoot)
          })));
};

const partiallyOrder = (graph, rootNodes) => {
  const withAncestors = addAncestors(graph, rootNodes);
  return withAncestors;
};


export default partiallyOrder;

