
import {contains, filterObject, mapObject } from "./utils";

export default (graph, focus) => {
  console.dir(graph);
  const neighborhood = filterObject(graph, (node, name) =>
                                    name === focus ||
                                    contains(node.children, focus) ||
                                    contains(node.parents, focus));

  const inNeighborhood = Object.keys(neighborhood);

  return mapObject(neighborhood,
                   node => mapObject(node, field => {
                     if (Array.isArray(field))
                       return field.filter(x => contains(Object.keys(neighborhood), x));

                     if (typeof field === 'object')
                       return filterObject(field, (_, key) => contains(inNeighborhood, key));

                     return field;
                   }));
};

