var ex = require("./lib/example-inputs").default;

var dotFormatForScope = require("./lib").dotFormatForScope;

var exec = require("child_process").exec;
var writeFileSync = require("fs").writeFileSync;

var graphDescription = dotFormatForScope(ex, { ranked: true, rootNodes: ["AST"] });

writeFileSync("foo.dot", graphDescription);

exec('cat foo.dot | dot -Tpng -Grankdir=BT > output.png', function () {
  console.log("done");
});
