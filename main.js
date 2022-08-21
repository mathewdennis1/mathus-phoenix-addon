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

        // integrating mobile ui stuff 
        mobile = require('mobile');




    // add view menu  entry

    //defign menu

    var menu = Menus.getMenu(Menus.AppMenuBar.VIEW_MENU);
    var contextMenu = Menus.getContextMenu(Menus.ContextMenuIds.PROJECT_MENU);

    // add command id and entry name

    var COMMAND_ID1 = 'mathus.phoenixAddon.modernize';
    var COMMAND_ID2 = 'mathus.phoenixAddon.colourize.toggle';
    var COMMAND_ID3 = 'mathus.phoenixAddon.colourize.red';
    var COMMAND_ID4 = 'mathus.phoenixAddon.colourize.green';



    const MENUENTRY_NAME1 = 'Modernize';
    const MENUENTRY_NAME2 = 'Colourize Toggle';
    const MENUENTRY_NAME3 = 'Colourize red palette';
    const MENUENTRY_NAME4 = 'Colourize green palette';




    // Register extension commands.
    CommandManager.register(MENUENTRY_NAME1, COMMAND_ID1, togglePanel1);
    CommandManager.register(MENUENTRY_NAME2, COMMAND_ID2, colourize_toggle);
    CommandManager.register(MENUENTRY_NAME3, COMMAND_ID3, colour_choice_red);
    CommandManager.register(MENUENTRY_NAME4, COMMAND_ID4, colour_choice_green);


    if (menu !== undefined) {
        menu.addMenuDivider();
        menu.addMenuItem(COMMAND_ID1, 'Ctrl-Alt-Shift-O');
        menu.addMenuItem(COMMAND_ID2, 'Ctrl-Alt-t');
        menu.addMenuItem(COMMAND_ID3);
        menu.addMenuItem(COMMAND_ID4);

    }


    if (contextMenu !== undefined) {
        contextMenu.addMenuDivider();
        contextMenu.addMenuItem(COMMAND_ID1);
    }






    // action on clicking the icon

    function colourize_toggle() {
        colourize_handler();
    }

    function colour_choice_red() {
        colourize_handler('red');
    }

    function colour_choice_green() {
        colourize_handler('green');
    }


    function togglePanel1() {
        ExtensionUtils.loadStyleSheet(module, 'mathus-baby.css');
    }

    function colourize_handler(colour_choice) {
        var r = document.querySelector(':root');
        let cs = getComputedStyle(r);

        if (colour_choice == 'green') {
            r.style.setProperty('--primary', '#beffbe');
            r.style.setProperty('--secondry', '#f4fff4');
            r.style.setProperty('--sidebar_bg', '#001a00');
            
        } else if (colour_choice == 'red') {
            r.style.setProperty('--primary', 'bisque');
            r.style.setProperty('--secondry', 'lightyellow');
            r.style.setProperty('--sidebar_bg', '#190000');

        } else if (cs.getPropertyValue('--primary') !== 'lightblue') {
            r.style.setProperty('--primary', 'lightblue');
            r.style.setProperty('--secondry', '#ecf6ff');
            r.style.setProperty('--sidebar_bg', '#010D2E');
      
        } else {
            r.style.setProperty('--primary', '');
            r.style.setProperty('--secondry', '');
            r.style.setProperty('--sidebar_bg','#47484B');
            r.style.setProperty('--sidebar_bg2','#3C3F41');
        }
    }

    //mobile ui part-----------

    //setup a global lookup variable..
    // this will be set later by resize observer
    var UI_mode = 'undifined';

    // setup functions..
    function enable_mobileUI() {

        // add a new  plugin bar entryS
        $(document.createElement('a'))
            .attr('id', 'navbar-toggle-icon')
            .attr('href', '#')
            .attr('title', 'Toggle navbar')
            .on('click', function () {
              toggleSidebar();
        // use phoenix sidebar hide function (works now but no animation!)
            //    SidebarView.hide();
            })
            .appendTo($('#main-toolbar .buttons'));

        UI_mode = 'mobile';
        ExtensionUtils.loadStyleSheet(module, 'mobile-styles.css');

    }

    function disable_mobileUI() {
        const mobileUI_plugin_icon = document.getElementById('navbar-toggle-icon');
        mobileUI_plugin_icon.remove();
        UI_mode = 'bigScreen';
        // use phoenix sidebar show function    
        //SidebarView.show();

    }
    
    // The default class for side bar is "sidebar panel quiet-scrollbars horz-resizable right-resizer collapsible".
    // We create 2 aditional classes and use them to swich between open and close states.
    // It is possible to do the same with  SidebarView function ,but this way we get a cool animation.
    
    function toggleSidebar() {
        const element = document.getElementById("sidebar");
        const style_sidebarOpen = "sidebar panel quiet-scrollbars horz-resizable right-resizer collapsible sidebar-open";
        const style_sidebarClose = "sidebar panel quiet-scrollbars horz-resizable right-resizer collapsible sidebar-close";
        
        if (element.className !==  style_sidebarOpen ) {
            element.className = style_sidebarOpen;
           //SidebarView.show();
        } else if (element.className == style_sidebarOpen) {
            element.className = style_sidebarClose;
            //SidebarView.hide();
        }
    }
    
    function toggleSidebar2() {
        const element = document.getElementById("sidebar");
        element.className = "sidebar panel quiet-scrollbars horz-resizable right-resizer collapsible sidebar-open";
        SidebarView.toggle();
    }
    // resize observer-------
    let prevWidth = 0;

    const observer = new ResizeObserver(entries => {
        for (const entry of entries) {
            const width = entry.borderBoxSize?. [0].inlineSize;
            if (typeof width === 'number' && width !== prevWidth) {
                prevWidth = width;
                // our code to execute when we have the change 
                var w = window.innerWidth;
                if (w < 600 && UI_mode !== 'mobile') {
                    enable_mobileUI();
                } else if (w > 600 && UI_mode == 'mobile') {
                    disable_mobileUI();
                }
            }
        }
    });

    observer.observe(document.body, {
        box: 'border-box'
    });
    //---------------
   
    function checkForDarkTheme(){
        // this check is disabled for now. as the function has not yet been added to phoenix.
        //if (ThemeManager.isInDarkMode() == false ){
         togglePanel1();
         colourize_toggle();
      //  }
    }
    
    
    AppInit.appReady( function() {
        
        checkForDarkTheme();
        
    });
    
   //--------------
});
