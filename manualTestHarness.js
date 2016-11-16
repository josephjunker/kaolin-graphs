var ex = require("./lib/example-inputs").default;
var makeGraph = require("./lib/make-graph").default;
var toDot = require("./lib/graph-to-dot-format").default;

var exec = require("child_process").exec;
var writeFileSync = require("fs").writeFileSync;

var graph = makeGraph(ex);

var graphDescription = toDot(graph, { ranked: true, rootNodes: ["AST"] });

writeFileSync("foo.dot", graphDescription);

exec('cat foo.dot | dot -Tpng -Grankdir=BT > output.png', function () {
  console.log("done");
});
