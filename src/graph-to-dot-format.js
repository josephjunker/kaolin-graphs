
import {flatMap, flatten, contains, values} from "./utils";
import partialOrdering from "./partial-ordering";

const makeAliases = graph =>
  Object.keys(graph).reduce((aliases, key) => {
    const transformed = "type_" + key.replace(/[^a-zA-Z0-9]/g, "");

    if (!contains(values(aliases), transformed)) {
      aliases[key] = transformed;
      return aliases;
    }

    let suffix = 2;

    while (contains(values(aliases), transformed + suffix)) { suffix++; }

    aliases[key] = transformed + suffix;
    return aliases;
  }, {});

const generateNodes = (graph, stylingInfo, aliases, specialNodes) =>
  Object.keys(graph)
    .map(typeName =>
         `${aliases[typeName]} ` + (specialNodes[typeName] || `[shape = box label = "${typeName}"];`));

const generateConnections = (types, stylingInfo, aliases) =>
  flatMap(
    types,
    type => type.children.map(childName => `${aliases[type.name]} -> ${aliases[childName]};`))
    .join("\n");

const generateRanks = (ranks, stylingInfo, aliases) => {
  if (!stylingInfo.rootNodes)
    throw new Error("Cannot generate a ranked graph without specifying root nodes");

  return ranks.slice().reverse().map((types, i) => {
    const rankType = i === 0 ?
      'source' :
      (i === ranks.length - 1 ?
       'sink' :
       'same');

    return `{ rank = ${rankType}; ${types.map(type => aliases[type.name])}; }`;
  }).join("\n");
};

const generateDigraph = (graph, stylingInfo = {}, specialNodes = {}) => {

  const ranked = partialOrdering(graph, stylingInfo.rootNodes || []),
        ordered = flatten(ranked),
        aliases = makeAliases(graph);

  return `digraph G {
    ${generateNodes(graph, stylingInfo, aliases, specialNodes).join("\n")}

    ${stylingInfo.ranked ? generateRanks(ranked, stylingInfo, aliases) : ""}

    ${generateConnections(ordered, stylingInfo, aliases)}
  }`;
};

export default generateDigraph;

