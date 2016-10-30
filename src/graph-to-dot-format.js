
import {base64, flatMap} from "./utils";

const charsOnly = str => base64(str).replace(/=/g, "");

const generateNodes = (graph, stylingInfo) =>
  Object.keys(graph)
    .map(typeName => `${charsOnly(typeName)} [shape = box label = "${typeName}"];`);

const generateConnections = (graph, stylingInfo) =>
  flatMap(
    Object.keys(graph),
    typeName => graph[typeName].children.map(childName => `${charsOnly(typeName)} -> ${charsOnly(childName)};`));

const generateDigraph = (graph, stylingInfo) => `digraph G {

  ${generateNodes(graph, stylingInfo).join("\n")}

  ${generateConnections(graph, stylingInfo).join("\n")}
}`;

export default generateDigraph;

