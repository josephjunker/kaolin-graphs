
import {merge, mapObject, union, deepEqual, iterateUntilStable, updateForKey} from "./utils";

const addAncestors = (graph, rootNodes) => {

  const withInitialAncestors = mapObject(
    graph,
    node =>
      updateForKey(node, 'ancestors', () => {
        return rootNodes.indexOf(node.name) !== -1 ?
          [] :
          node.parents;
      }));

  return iterateUntilStable(
    withInitialAncestors,
    graph => mapObject(
      graph,
      node =>
        rootNodes.indexOf(node.name) !== -1 ?
          node :
          updateForKey(node, 'ancestors', oldAncestors =>
            union(oldAncestors,
                  ...oldAncestors.map(ancestorName => graph[ancestorName].ancestors))
              .sort()))); // Stabilize to be sure that we'll converge
};

const partiallyOrder = (graph, rootNodes) => {
  const withAncestors = addAncestors(graph, rootNodes);
  return withAncestors;
};


export default partiallyOrder;

