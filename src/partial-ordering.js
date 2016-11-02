
import {
  merge,
  mapObject,
  union,
  deepEqual,
  iterateUntilStable,
  updateForKey,
  compose,
  contains,
  groupBy,
  values
} from "./utils";

const addAncestorInfo = (graph, rootNodes) => {

  const initial = mapObject(
    graph,
    node =>
      merge(node, {
        ancestors: contains(rootNodes, node.name) ?
          [] :
          node.parents,
        distanceToRoot: contains(rootNodes, node.name) ?
          0 :
          Infinity
      }));

  return iterateUntilStable(
    initial,
    graph => mapObject(
      graph,
      node =>
        contains(rootNodes, node.name) ?
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


const addRanks = graph => {
  const initial = mapObject(graph, node => merge(node, { rank: 0 }));

  const sameRankFartherFromRoot = graph => {
    const nodes = values(graph);
    return nodes.filter(
      node =>
        nodes.find(
          otherNode =>
            node.rank <= otherNode.rank &&
            otherNode.distanceToRoot < node.distanceToRoot));
  };

  const increaseRanksOfNodes = (graph, badNodes) =>
    badNodes.reduce(
      (graph, badNode) => updateForKey(
        graph,
        badNode.name,
        node => updateForKey(
          node,
          'rank',
          rank => rank + 1)),
      graph);

  return iterateUntilStable(
    initial,
    graph => {
      return increaseRanksOfNodes(
        graph,
        sameRankFartherFromRoot(graph));});
};

const order = (graph, rootNodes) => {
  const withAncestors = addAncestorInfo(graph, rootNodes);

  return groupBy(values(addRanks(withAncestors)), ({rank}) => rank)
    .map(group => group.sort((x, y) => {
      const yPrecedesX = contains(x.ancestors, y.name),
            xPrecedesY = contains(y.ancestors, x.name);

      if (yPrecedesX && !xPrecedesY) return -1;
      if (xPrecedesY && !yPrecedesX) return 1;
      return x.name.localeCompare(y.name);
    }))
    .sort((x, y) => x[0].rank > y[0].rank);
};

export default order;

