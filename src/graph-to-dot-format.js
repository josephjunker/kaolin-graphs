
import {base64, flatMap, flatten} from "./utils";
import partialOrdering from "./partial-ordering";

const charsOnly = str => base64(str).replace(/=/g, "");

const generateNodes = (graph, stylingInfo) =>
  Object.keys(graph)
    .map(typeName => `${charsOnly(typeName)} [shape = box label = "${typeName}"];`);

const generateConnections = (types, stylingInfo) =>
  flatMap(
    types,
    type => type.children.map(childName => `${charsOnly(type.name)} -> ${charsOnly(childName)};`))
    .join("\n");

const generateRanks = (ranks, stylingInfo) => {
  if (!stylingInfo.rootNodes)
    throw new Error("Cannot generate a ranked graph without specifying root nodes");

  return ranks.slice().reverse().map((types, i) => {
    const rankType = i === 0 ?
      'source' :
      (i === ranks.length - 1 ?
       'sink' :
       'same');

    return `{ rank = ${rankType}; ${types.map(type => charsOnly(type.name))}; }`;
  }).join("\n");
};

const generateDigraph = (graph, stylingInfo = {}) => {

  const ranked = partialOrdering(graph, stylingInfo.rootNodes || []),
        ordered = flatten(ranked);

  return `digraph G {
    ${generateNodes(graph, stylingInfo).join("\n")}

    ${stylingInfo.ranked ? generateRanks(ranked, stylingInfo) : ""}

    ${generateConnections(ordered, stylingInfo)}
  }`;
};

export default generateDigraph;

