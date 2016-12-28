
const graphs = require("../lib"),
      {spawn, exec} = require("child_process"),
      {open, closeSync} = require("fs"),
      {parallel} = require("async"),
      exampleScope = require("../example-inputs/ast");

const makeImage = (filename, contents) => cb => {
  open("./example-images/" + filename, "ax", (err, outputFile) => {
    if (err) throw err;

    console.log("starting processing for file " + filename);

    const proc = spawn("dot",
                       ["-Tpng", "-Grankdir=BT"],
                       { stdio: ["pipe", outputFile, process.stderr] });

    proc.stdin.write(contents);
    proc.stdin.end();

    proc.on("close", code => {
      if (code) {
        console.log("an error occurred while trying to produce file " + filename);
      } else {
        console.log("done processing for file " + filename);
      }

      closeSync(outputFile);
    });
  });
};

// delete existing dir first
exec("rm -rf ./example-images && mkdir example-images", (err, stdout, stderr) => {
  if (err) throw err;
  console.log(stdout);
  console.error(stderr);
  parallel([
    makeImage("whole-scope-unordered.png", graphs.dotFormatForScope(exampleScope)),
    makeImage("whole-scope-ordered.png", graphs.dotFormatForScope(exampleScope,
                                                                  { ranked: true, rootNodes: ["AST"] }))
  ].concat(Object.keys(exampleScope.getTypes()).map(
    typeName => makeImage(`${typeName}-neighborhood-simple.png`,
                      graphs.dotFormatForNeighborhood(exampleScope, typeName))
  )).concat(Object.keys(exampleScope.getTypes()).map(
    typeName => makeImage(`${typeName}-neighborhood-detailed.png`,
                      graphs.dotFormatForNeighborhood(exampleScope, typeName, { expandStructs: true }))
  )));
});

