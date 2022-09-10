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
        colour = require('UITheme/colour'),
        UIsettings = require('UITheme/UIsettings');




    function loadStylesheet() {
        ExtensionUtils.loadStyleSheet(module, 'mathus-baby.css');
    }

    function colourize_handler(colour_choice, primary, secondry, sidebar_bg) {
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


        } else if (colour_choice == 'dark') {
            r.style.setProperty('--primary', '');
            r.style.setProperty('--secondry', 'black');
            // r.style.setProperty('--sidebar_bg', '#00ff43');
            // r.style.setProperty('--sidebar_bg2', '#3C3F41');

        } else if (colour_choice == 'manual') {
            r.style.setProperty('--primary', primary);
            r.style.setProperty('--secondry', secondry);
            r.style.setProperty('--sidebar_bg', sidebar_bg);

        } else if (cs.getPropertyValue('--primary') !== 'lightblue' || colour_choice == 'blue' || colour_choice == 'Default') {
            r.style.setProperty('--primary', 'lightblue');
            r.style.setProperty('--secondry', '#ecf6ff');
            r.style.setProperty('--sidebar_bg', '#010D2E');
        }
        // when we turn the thing off 
        else {
            r.style.setProperty('--primary', '');
            r.style.setProperty('--secondry', '');
            r.style.setProperty('--sidebar_bg', '#47484B');
            r.style.setProperty('--sidebar_bg2', '#3C3F41');
        }
    }

 

    //--------------
    // observer -- trigger on theme cheange 
    ThemeManager.on("themeChange", function () {
        // we set a time out becuase we need to wait for the theme object to get created 
        setTimeout(colour_man, 1000);

    });



    function colour_man() {
        //if (passthrough== true ){colourize_handler('$colour');}
        if (auto_UI_theming == true || auto_UI_theming == undefined) {
            var rgb = colour.rgb_split(read_color());
            if (check_for_default(rgb) == true) {
                let rgb2 = colour.rgb_split(read_color('editor_background'));
                // we disable this for now as rgba colrs are not handled after that turn it to true
                if (check_for_default(rgb2) == undefined) {
                    colourize_handler('blue');
                    //alert('we are at level-2'+ rgb2);
                } else if (check_for_default(rgb2) == undefined) {
                    HSLColour_gen(rgb);
                }
            } else if (check_for_default(rgb) == undefined) {
                HSLColour_gen(rgb);
            }
        } else if (user_selected_UItheme) {
           // alert('user choice exits ' + user_selected_UItheme);
            colourize_handler(user_selected_UItheme);
        }

        setTimeout(dark_handler, 400);

    }




    function HSLColour_gen(rgb) {
        var hsl = colour.RGBToHSLObject(rgb[0], rgb[1], rgb[2]);
        var primary = 'hsl(' + hsl[0] + ',' + ' 100% ' + ',' + ' 85% ' + ')';
        var secondry = 'hsl(' + hsl[0] + ',' + ' 100% ' + ',' + ' 95% ' + ')';
        var sidebar_bg = 'hsl(' + hsl[0] + ',' + ' 100% ' + ',' + ' 04% ' + ')';
        colourize_handler('manual', primary, secondry, sidebar_bg);


        //alert('we are at the end');
        //alert (hsl);
        //alert (sidebar_bg);
        //alert(secondry);
    }

    function dark_handler() {
        var dark = ThemeManager.getCurrentTheme().dark;
        // alert(dark);
        if (dark == true) {
            colourize_handler('dark');
        }
    }
    //------------------------



    function read_color(choice) {
        var r = document.querySelector('#editor-holder .CodeMirror .CodeMirror-linenumber, .editor-holder .CodeMirror .CodeMirror-linenumber, #editor-holder .CodeMirror .CodeMirror-scroll, .editor-holder .CodeMirror .CodeMirror-scroll, #editor-holder .CodeMirror .CodeMirror-gutters, .editor-holder .CodeMirror .CodeMirror-gutters');
        let cs = getComputedStyle(r);
        var colour = cs.getPropertyValue('color');
        var background_colour = cs.getPropertyValue('background-color');

        //alert('background colr =' +background_colour);
        //alert (colour);
        if (choice == 'text_colour' || choice == undefined) {
            return (colour);
        } else if (choice == 'editor_background' || choice == 'main_bg') {
            return (background_colour);
        }
    }

    function check_for_default(rgb) {
        //alert(rgb[0]);
        if (rgb[0] == '83' && rgb[1] == '83' && rgb[2] == '83') {
            /*alert('txt clr is dflt');*/
            return true;
        } else if (rgb[0] == '0' && rgb[0] == '0' && rgb[0] == '0') {
            alert('bg clr is dflt');
            return true;
        }

    }
    //-----------------

    // test areaa
    //this variable have to be loaded from prefrence manager
    //function read_pref(){
    let auto_UI_theming = prefs.get('themeScrollbars');
    let user_selected_UItheme = prefs.get('theme');
    //alert(auto_UI_theming+' '+user_selected_UItheme);
    
    //}
    
    function enable_auto_UI_theming(control) {
        auto_UI_theming = control;
        // alert(auto_UI_theming);
    }
    //let user_selected_UItheme = 'blue';

    //function save_user_UItheme_selection(selection) {
    //alert("run");
    //user_selected_UItheme = selection;
    //}
//---------------------------------------------------------------------
   function masterControl() {

        loadStylesheet();
        //read_pref();

        // we need to manully set this untill a fail safe is added to colour man.
        colourize_handler('blue');
        setTimeout(colour_man, 5500);

    }


   
    // -----------------------------------------------------------------
    
    EventDispatcher.makeEventDispatcher(exports);

    exports.enable_auto_UI_theming = enable_auto_UI_theming;
    exports.colour_man = colour_man;
    exports.colourize_handler = colourize_handler;
    exports.dark_handler = dark_handler;
    exports.masterControl = masterControl;


});
