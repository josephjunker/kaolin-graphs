kaolin-graphs
=================

Generates dependency diagrams of a data model that is specified using [Kaolin](https://github.com/JosephJNK/kaolin-js) schemas

## Installation
`npm install kaolin-graphs`

## Overview
`kaolin-graphs` takes a kaolin `scope` object, and allows you to produce graphvis dot files for graphs of the types in this scope. It provides options to modify the style and detail of these graphs.

## Example
The most basic usage is to draw a non-hierarchical graph of all of the types in a scope:
```es6
const kaolinGraphs = require("kaolin-graphs");
const writeFileSync = require("fs").writeFileSync;
const scope = require("./some-kaolin-scope");

const graphDescription = kaolinGraphs.dotFormatForScope(scope);

writeFileSync("graph.dot", graphDescription);
```
This produces the file `graph.dot`, which can be compiled by graphvis with the following:
```
cat graph.dot | dot -Tpng -Grankdir=BT > output.png
```
For the scope given in the example directory, (a schema for the AST of a
simple imaginary language) we produce this image:
![unordered graph](https://raw.githubusercontent.com/JosephJNK/kaolin-graphs/master/example-images/whole-scope-unordered.png)

We can produce a graph that partially orders its nodes, by raising types above their dependencies. To customize the graph in this way we can pass an options object to `dotFormatForScope`:
```es6
dotFormatForScope(scope, { ranked: true, rootNodes: ["AST"] });
```
Producing a more structured graph:
![ordered graph](https://raw.githubusercontent.com/JosephJNK/kaolin-graphs/master/example-images/whole-scope-ordered.png)

We can zoom into the "neighborhood" of a type, that is, the types which it depends on and the types which depend on it, by using the `dotFormatForNeighborhood` function:
```es6
const graphDescription = kaolinGraphs.dotFormatForNeighborhood(ex, "Expression");
```
![basic neighborhood](https://raw.githubusercontent.com/JosephJNK/kaolin-graphs/master/example-images/Expression-neighborhood-simple.png)
And when focused like this, we can expand the depiction of `strictStruct` and `laxStruct` types to show their structure:

```es6
dotFormatForNeighborhood(ex, "Expression", { expandStructs: true });
```
![detailed neighborhood](https://raw.githubusercontent.com/JosephJNK/kaolin-graphs/master/example-images/Expression-neighborhood-detailed.png)

## Rendering with Graphviz
To produce images, you need to have [Graphvis](http://www.graphviz.org) installed, providing the command line utility `dot`. The simplest way to render an image is to output the string produced by this library to a file, say `temp.txt`, and then pipe this file's contents into `dot`, as in `cat temp.txt | dot -Tpng -Grankdir=BT > image.png`. The `-Tpng` option is to select `.png` as the file's output type; if you wish to output another filetype, do so following graphvis's documentation. `-Grankdir=BT` is to cause the graph to output correctly when the `{ ranked: true }` option is used. If this command line argument is omitted, then the root nodes will appear at the bottom of the image rather than at the top.

If you wish to render images directly from JavaScript without using a temp file, check `scripts/build-examples.js` as an example of how to do so.

## API
### dotFormatForScope(scope, options)
Produces a string in graphvis dot format, representing a drawing of all of the types in the given scope and their relationships.
* scope: a Kaolin scope object
* options: an object
The schema for `options` is:
```es6
laxStruct({
  rootNodes: optional(array(string())),
  ranked: optional(boolean())
});
```
Specifying `rootNodes` and `ranked` will cause the types to be arranged in a hierarchy based on their dependencies, with the root nodes on top. The strings in the `rootNodes` array must be the name of types available in the provided scope. If no `rootNodes` are provided, `ranked` will have no effect.

### dotFormatForNeighborhood(scope, focus, options)
Produces a string in graphvis dot format, representing a drawing of all of the types in the given scope which directly depend on the given `focus` and which the given `focus` directly depends on, and their relationships.
* scope: a Kaolin scope object
* focus: a string; a type with this name must exist in `scope`
* options: an object
The schema for `options` is:
```es6
laxStruct({
  expandStructs: optional(boolean(),
  rootNodes: optional(array(string())),
  ranked: optional(boolean())
});
```
Specifying `expandStructs` as `true` will cause structs to be shown in a detailed view, with information on each of their fields. `rootNodes` and `ranked` have the same behavior as in [dotFormatForScope](#dotFormatForScopescope-options).

### orderTypes(scope, rootNodes)
Produces a data structure containing the types in `scope` in a hopefully reasonable order, which orders types by the number of hops they are from the root nodes, and secondarily places types before the types which depend on them.
* scope: a Kaolin scope object
* rootNodes: an array of type names
`orderTypes` returns an array of nodes which each have this schema:
```es6
strictStruct({
  name: string(),
  children: array(string()),
  childCounts: dictionary(string(), number()),
  docString: optional(string()),
  parents: array(string()),
  parentCounts: dictionary(string(), number()),
  siblings: array(string()),
  siblingCounts: dictionary(string(), number()),
  ancestors: array(string()),
  distanceToRoot: number(),
  rank: number()
})
```

## LICENSE
MIT
