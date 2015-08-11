// =========== [ REQUIRE ] ===========
var co = require("co");
var dmPrompt = require("dm-prompt").Inquirer;
var path = require("path");
var modules = require("./../getModules/index.js").start();

// =========== [ MODULE DEFINE ] ===========
var job = {};

// =========== [ job.start() ] ===========
job.start = co.wrap(function*() {
    try {
        console.log("start viewAdd");
        //TODO proof if view exists

        // choose module path
        var moduleChoices = [];
        for (var i = 0, l = modules.length; i < l; i++) {
            var module = modules[i];
            moduleChoices.push(module.path);
        }
        var moduleAnswer =
            yield dmPrompt({
                type: "list",
                name: "module",
                message: "Please choose a module:",
                choices: moduleChoices
            });
        var modulePath = moduleAnswer.module;

        // get module name
        var moduleName = modulePath.substring(modulePath.lastIndexOf("/") + 1, modulePath.length);
        var moduleNameCapitalize = moduleName.charAt(0).toUpperCase() + moduleName.slice(1);

        // get view name
        var viewNameAnswer =
            yield dmPrompt({
                type: "input",
                name: "viewName",
                message: "Please enter the view Name:"
            });
        var viewName = viewNameAnswer.viewName;
        var viewNameCapitalize = viewName.charAt(0).toUpperCase() + viewName.slice(1);

        // add route
        var routeString = [
            '// AUTOMATICALLY ADDED ROUTES',
            '',
            "    $stateProvider.state('" + moduleName + "." + viewName + "', {",
            '        url: "/' + viewName + '",',
            '        views: {',
            "            'menuContent': {",
            '                templateUrl: "modules/' + moduleName + '/templates/' + viewName + '.html",',
            "                controller: '" + moduleNameCapitalize + viewNameCapitalize + "Ctrl'",
            "            }",
            "        }",
            "    });",
            ""
        ].join("\n");

        var routesPath = modulePath + "/app/routes.js";
        sed('-i', '// AUTOMATICALLY ADDED ROUTES', routeString, routesPath);

        // add template
        var templateString = [
            '<ion-view view-title="' + moduleNameCapitalize + " " + viewNameCapitalize + '">',
            '    <ion-content>',
            '        Hello ' + viewNameCapitalize,
            '    </ion-content>',
            '</ion-view>'
        ].join("\n");

        var templatePath = modulePath + "/templates/" + viewName + ".html";
        templateString.to(templatePath);

        // add controller
        var ctrlString = [
            moduleName + "Controllers.controller('" + moduleNameCapitalize + viewNameCapitalize + "Ctrl', function($scope) {",
            '    console.log("' + moduleNameCapitalize + viewNameCapitalize + 'Ctrl");',
            '});'
        ].join("\n");
        var ctrlPath = modulePath + "/controllers/" + viewName + "Ctrl.js";
        ctrlString.to(ctrlPath);

        // add menu item
        var menuString = [
            '                <ion-item menu-close href="#/' + moduleName + '/' + viewName + '">',
            '                    ' + viewNameCapitalize,
            '                </ion-item>'
        ].join("\n");

        var menuSideAnswer =
            yield dmPrompt({
                type: "list",
                name: "menuSide",
                message: "Where do you want to place the menu item:",
                choices: [
                    "left",
                    "right"
                ]
            });
        var menuPath = modulePath + "/app/layout.html";
        var menuSide = menuSideAnswer.menuSide;
        if (menuSide === "left") {
            var replacer = '                <!-- AUTOMATICALLY ADDED MENU LEFT -->';
        } else if (menuSide === "right") {
            var replacer = '                <!-- AUTOMATICALLY ADDED MENU RIGHT -->';
        }
        sed('-i', replacer, replacer + "\n" + menuString, menuPath);

        // add controller src to index.html
        var ctrlSrcString = [
            '    <!-- kegelapp module controllers -->',
            '    <script src="modules/' + moduleName + '/controllers/' + viewName + 'Ctrl.js"></script>'
        ].join("\n");
        var indexHtmlPath = path.resolve(modulePath + "/../../index.html");
        sed('-i', '    <!-- kegelapp module controllers -->', ctrlSrcString, indexHtmlPath);

    } catch (e) {
        console.log("Filename: ", __filename, "\n", e.stack);
    }
    return yield Promise.resolve();
}); // job.start()

// =========== [ MODULE EXPORT ] ===========
module.exports = job;
