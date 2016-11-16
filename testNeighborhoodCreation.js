var ex = require("./lib/example-inputs").default;

var dotFormatForNeighborhood = require("./lib").dotFormatForNeighborhood;

var exec = require("child_process").exec;
var writeFileSync = require("fs").writeFileSync;

var graphDescription = dotFormatForNeighborhood(ex, "Expression", {});

writeFileSync("foo.dot", graphDescription);

exec('cat foo.dot | dot -Tpng -Grankdir=BT > output.png', function () {
  console.log("done");
});
