// =========== [ REQUIRE ] ===========
var co = require("co");
var colors = require("colors");
require("shelljs/global");

// =========== [ MODULE DEFINE ] ===========
var job = {};

// =========== [ job.start() ] ===========
job.start = function() {
    try {
        console.log("start getModules");
        var modules = [];
        var currentPath = process.cwd();
        var modulesPath = currentPath + "/modules";
        if (test("-d", modulesPath)) {
            console.log("modules existent");
            var moduleNames = ls(modulesPath);
            console.log(moduleNames);
            for (var i = 0, l = moduleNames.length; i < l; i++) {
                var module = {};
                module.name = moduleNames[i];
                module.path = modulesPath + "/" + module.name;
                modules.push(module)
            }
        } else {
            console.log("No directory modules existent in current path!".red);
            process.exit();
        }
    } catch (e) {
        console.log("Filename: ", __filename, "\n", e.stack);
    }

    return modules;
}; // job.start()

// =========== [ MODULE EXPORT ] ===========
module.exports = job;
