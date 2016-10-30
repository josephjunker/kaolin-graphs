
import {compose, mapObject, foldObject, uniqueStrings, incidencesOfStrings} from "./utils";

const collectReferences = type => foldObject(['meta'], [], type, (acc, node) => {
  if (node && node.name === "reference") acc.push(node.referenceName);
  return acc;
});

const makeGraph = types => mapObject(types, type => {
  const children = collectReferences(type),
        childCounts = incidencesOfStrings(children);

  return {
    children: uniqueStrings(children),
    childCounts
  };
});

const addParents = graph => graph;

const addSiblings = graph => graph;

export default scope => compose(
    makeGraph,
    addParents,
    addSiblings
  )(scope.getTypes());

