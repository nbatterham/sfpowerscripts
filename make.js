// parse command line options
var minimist = require("minimist");
var mopts = {
  string: ["version", "stage", "taskId"],
  boolean: ["public"]
};

var options = minimist(process.argv, mopts);

// remove well-known parameters from argv before loading make
process.argv = options._;

// modules
var shell = require("shelljs");
var make = require("shelljs/make");
var path = require("path");
var os = require("os");
var cp = require("child_process");
var fs = require("fs");
var semver = require("semver");
var rimraf = require("rimraf");

// global paths
var sourcePath = path.join(__dirname, "BuildTasks");
var binariesPath = path.join(__dirname, "build");
var packagesPath = path.join(__dirname, "dist");

// make targets
target.clean = function() {
  console.log("clean: cleaning binaries");

  shell.rm("-Rf", binariesPath);
  shell.mkdir("-p", binariesPath);
};

target.copy = function() {
  target.clean();

  //copy directory
  var taskOutputPath = path.join(binariesPath, "BuildTasks");

  console.log("copy: copy task");
  copyRecursiveSync(sourcePath, taskOutputPath);

  // rimraf.sync(taskOutputPath + "/**/**/*.ts");

  // copy external modules
  console.log("build: copying externals modules");
  // getExternalModules(binariesPath);

  // copy resources
  console.log("build: copying resources");
  [
    "README.md",
    "overview.md",
    "LICENSE.txt",
    "tslint.json",
    "vss-extension.json"
  ].forEach(function(file) {
    shell.cp("-Rf", path.join(__dirname, file), binariesPath);
    console.log("  " + file + " -> " + path.join(binariesPath, file));
  });

  shell.cp("-Rf", path.join(__dirname, "*.png"), binariesPath);
  console.log("  images copied");
};

target.incrementversion = function() {
  console.log("incrementversion");

  console.log(options);
  if (options.version) {
    if (options.version === "auto") {
      var ref = new Date(2000, 1, 1);
      var now = new Date();
      var major = 2;
      var minor = Math.floor((now - ref) / 86400000);
      var patch = Math.floor(
        Math.floor(
          now.getSeconds() + 60 * (now.getMinutes() + 60 * now.getHours())
        ) * 0.5
      );
      options.version = major + "." + minor + "." + patch;
    }

    if (!semver.valid(options.version)) {
      console.error("package", "Invalid semver version: " + options.version);
      process.exit(1);
    }
  }

  switch (options.stage) {
    case "dev":
      options.public = false;
      break;
  }

 
  updateExtensionManifest(__dirname, options, true);

};

target.publish = function() {
  console.log("publish: publish task");

  console.log(options);

  shell.exec(
    'tfx extension publish --vsix "' +
      packagesPath +
      "/AzlamSalam.sfpowerscripts-" +
      options.version +
      '.vsix"' +
      " --share-with cloudfirstanz --token "+options.token
  );
};

updateExtensionManifest = function(dir, options, isOriginalFile) {
  var manifestPath = path.join(dir, "vss-extension.json");
  var manifest = JSON.parse(fs.readFileSync(manifestPath));

  if (options.version) {
    manifest.version = options.version;
  }

  if (options.stage && !isOriginalFile) {
    manifest.id = manifest.id + "-" + options.stage;
    manifest.name = manifest.name + " (" + options.stage + ")";
  }

  manifest.public = options.public;

  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 4));
};

updateTaskManifest = function(dir, options, isOriginalFile) {
  var tasksPath = path.join(dir, "BuildTasks");
  var tasks = fs.readdirSync(tasksPath);
  console.log(tasks.length + " tasks found.");
  tasks.forEach(function(task) {
    var manifestPath = path.join(tasksPath, task, "task.json");

    if (fs.existsSync(manifestPath)) {
      var manifest = JSON.parse(fs.readFileSync(manifestPath));

      if (options.version) {
        manifest.version.Major = semver.major(options.version);
        manifest.version.Minor = semver.minor(options.version);
        manifest.version.Patch = semver.patch(options.version);
      }

      if (!isOriginalFile) {
        manifest.helpMarkDown =
          "v" +
          manifest.version.Major +
          "." +
          manifest.version.Minor +
          "." +
          manifest.version.Patch +
          " - " +
          manifest.helpMarkDown;
      }

      if (options.stage && !isOriginalFile) {
        manifest.friendlyName = manifest.friendlyName + " (" + options.stage;

        if (options.version) {
          manifest.friendlyName = manifest.friendlyName + " " + options.version;
        }

        manifest.friendlyName = manifest.friendlyName + ")";
      }

      fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 4));
    }
  });
};

function installTasks(dir) {
  echo("Installing task dependencies...");

  var tasksPath = path.join(dir, "task");
  var tasks = fs.readdirSync(tasksPath);
  console.log(tasks.length + " tasks found.");
  tasks.forEach(function(task) {
    console.log("Processing task " + task);
    process.chdir(path.join(tasksPath, task));

    console.log("Installing npm dependencies for task...");
    if (exec("npm install --only=prod").code != 0) {
      console.log("npm install for task " + task + " failed");
      exit(1);
    }
  });

  process.chdir(dir);
}

copyRecursiveSync = function(src, dest) {
  var exists = fs.existsSync(src);
  if (exists) {
    var stats = fs.statSync(src);
    var isDirectory = stats.isDirectory();
    if (isDirectory) {
      exists = fs.existsSync(dest);
      if (!exists) {
        fs.mkdirSync(dest);
      }
      fs.readdirSync(src).forEach(function(childItemName) {
        copyRecursiveSync(
          path.join(src, childItemName),
          path.join(dest, childItemName)
        );
      });
    } else {
      fs.copyFileSync(src, dest);
    }
  }
};
