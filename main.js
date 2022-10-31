/*!
 * 
 *
 * @author Mathew Dennis
 * @license  MIT
 */
define(function (require, exports, module) {
    'use strict';

    // Get dependencies.
    var Async = brackets.getModule('utils/Async'),
        Menus = brackets.getModule('command/Menus'),
        CommandManager = brackets.getModule('command/CommandManager'),
        Commands = brackets.getModule('command/Commands'),
        PreferencesManager = brackets.getModule('preferences/PreferencesManager'),
        ProjectManager = brackets.getModule('project/ProjectManager'),
        EditorManager = brackets.getModule('editor/EditorManager'),
        DocumentManager = brackets.getModule('document/DocumentManager'),
        WorkspaceManager = brackets.getModule('view/WorkspaceManager'),
        Resizer = brackets.getModule('utils/Resizer'),
        AppInit = brackets.getModule('utils/AppInit'),
        FileUtils = brackets.getModule('file/FileUtils'),
        FileSystem = brackets.getModule('filesystem/FileSystem'),
        ExtensionUtils = brackets.getModule('utils/ExtensionUtils'),
        NodeDomain = brackets.getModule("utils/NodeDomain"),
        SidebarView = brackets.getModule('project/SidebarView'),
        ThemeManager = brackets.getModule('view/ThemeManager'),
        ThemeSettings = brackets.getModule('view/ThemeSettings'),
        prefs = PreferencesManager.getExtensionPrefs("UIthemes"),

        // integrating mobile ui stuff 
        mobile = require('mobileUI'),
        UITheme = require('UITheme/UITheme'),
        colour = require('UITheme/colour'),
        UIsettings = require('UITheme/UIsettings'),
        snippetSearch = require('snippetSearch/snippet');
    
    // let UIThemeSettings = require('UITheme/UIThemeSettings');




    // add view menu  entry

    //defign menu

    var menu = Menus.getMenu(Menus.AppMenuBar.VIEW_MENU);
    var contextMenu = Menus.getContextMenu(Menus.ContextMenuIds.PROJECT_MENU);

    // add command id and entry name

    var COMMAND_ID1 = 'mathus.phoenixAddon.modernize';
    var COMMAND_ID2 = 'mathus.phoenixAddon.colourize.toggle';
    var COMMAND_ID3 = 'mathus.phoenixAddon.colourize.red';
    var COMMAND_ID4 = 'mathus.phoenixAddon.colourize.green';
    var COMMAND_ID5 = 'mathus.phoenixAddon.uithemesettings.open';
    var COMMAND_ID6 = 'mathus.phoenixAddon.snippetSearch';



    const MENUENTRY_NAME1 = 'Modernize';
    const MENUENTRY_NAME2 = 'Colourize Toggle';
    const MENUENTRY_NAME3 = 'Colourize red palette';
    const MENUENTRY_NAME4 = 'Colourize green palette';
    const MENUENTRY_NAME5 = 'UI Theme Settings';
    const MENUENTRY_NAME6 = 'Snippet Search';




    // Register extension commands.
    CommandManager.register(MENUENTRY_NAME1, COMMAND_ID1, UITheme.masterControl);
    CommandManager.register(MENUENTRY_NAME2, COMMAND_ID2, colourize_toggle);
    CommandManager.register(MENUENTRY_NAME3, COMMAND_ID3, colour_choice_red);
    CommandManager.register(MENUENTRY_NAME4, COMMAND_ID4, colour_choice_green);
    CommandManager.register(MENUENTRY_NAME5, COMMAND_ID5, UIsettings.showDialogue);
    CommandManager.register(MENUENTRY_NAME6, COMMAND_ID6, snippetSearch.showSnippetSearch );


    if (menu !== undefined) {
        menu.addMenuDivider();
        menu.addMenuItem(COMMAND_ID1, 'Ctrl-Alt-Shift-O');
        menu.addMenuItem(COMMAND_ID2, 'Ctrl-Alt-l');
        menu.addMenuItem(COMMAND_ID3);
        menu.addMenuItem(COMMAND_ID4);
        menu.addMenuItem(COMMAND_ID5, 'Ctrl-Alt-t', 'AFTER', 'mathus.phoenixAddon.modernize');
        menu.addMenuItem(COMMAND_ID6);

    }
    //'view.themesOpenSetting'

    if (contextMenu !== undefined) {
        contextMenu.addMenuDivider();
        contextMenu.addMenuItem(COMMAND_ID1);
    }



    // action on clicking the icon

    function colourize_toggle() {
        UITheme.colourize_handler();
    }

    function colour_choice_red() {
        UITheme.colourize_handler('red');
    }

    function colour_choice_green() {
        UITheme.colourize_handler('green');
    }

    
       // --------------
    AppInit.appReady(function () {

        UITheme.masterControl();

    });
   //-----------------

});
