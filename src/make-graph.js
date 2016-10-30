
import {
  compose,
  mapObject,
  foldObject,
  uniqueStrings,
  incidencesOfStrings,
  merge,
  filterObject,
  intersection
} from "./utils";

const collectReferences = type => foldObject(['meta'], [], type, (acc, node) => {
  if (node && node.name === "reference") acc.push(node.referenceName);
  return acc;
});

const makeGraph = types => mapObject(types, (type, name) => {
  const children = collectReferences(type),
        childCounts = incidencesOfStrings(children);

  return {
    name,
    children: uniqueStrings(children),
    childCounts
  };
});

const addParents = graph => mapObject(graph, node => {
  const parents = Object.keys(graph)
    .filter(typeName => graph[typeName].childCounts[node.name]);

  return merge(node, {
    parents: uniqueStrings(parents),
    parentCounts: incidencesOfStrings(parents)
  });
});

const addSiblings = graph => mapObject(graph, node => {
  const siblingCounts =
    filterObject(
      mapObject(
        graph,
        otherNode => otherNode.name !== node.name && intersection(node.parents, otherNode.parents).length),
      Boolean);

  return merge(node, {
    siblings: Object.keys(siblingCounts),
    siblingCounts
  });
});

export default scope => compose(
    makeGraph,
    addParents,
    addSiblings
  )(scope.getTypes());

