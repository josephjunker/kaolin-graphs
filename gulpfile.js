require("babel-register");

const gulp = require("gulp"),
      babel = require("gulp-babel"),
      mocha = require("gulp-mocha"),
      {spawn} = require("child_process");

gulp.task("test", ["build"], () =>
    gulp.src("./tests/**/*.tests.js", {read: false})
        .pipe(mocha())
);

gulp.task("build", () =>
    gulp.src("src/**/*.js")
        .pipe(babel({
            presets: ["es2015"]
        }))
        .pipe(gulp.dest("lib"))
);

gulp.task("buildExamples", ["build"], cb => {
  const proc = spawn("node", ["scripts/build-examples.js"]);
  let errorOccurred = false;

  proc.stdout.on("data", data => {
    console.log(data.toString());
  });

  proc.stderr.on("data", data => {
    const errString = data.toString().trim;
    if (!errString.length) return;
    console.error(`An error occurred: [${errString}`);
    errorOccurred = true;
  });

  proc.on("error", cb);

  proc.on("close", () => {
    if (errorOccurred) {
      return cb("An error occurred when building examples");
    }

    cb();
  });
});

gulp.task("default", ["build", "test"]);
gulp.task("prepublish", ["build", "test", "buildExamples"]);

