define(function (require, exports, module) {
    var Dialogs = brackets.getModule("widgets/Dialogs"),
        ExtensionUtils = brackets.getModule("utils/ExtensionUtils"),

        Strings = require("snippetSearch/Strings"),
        $template = require("text!html/snippetSearch.html");

   ExtensionUtils.loadStyleSheet(module, "style.css");

    function showSnippetSearch() {
        Dialogs.showModalDialogUsingTemplate($template);
    }

    function contentDisplayMan() {}

    // export functions

    exports.showSnippetSearch = showSnippetSearch;
});
