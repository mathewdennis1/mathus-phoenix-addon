define(function (require, exports, module) {

    var Dialogs             = brackets.getModule("widgets/Dialogs"),
        //EventDispatcher = brackets.getModule("utils/EventDispatcher"),
        //Strings             = brackets.getModule("strings"),
       // newProject          = brackets.getModule("text!assets/new-project/new-project-website.html"),
        
        Strings  = require("UITheme/Strings"),
        settingsTemplete  = require("text!html/UIThemeSettings.html"),
        UITheme  = require("UITheme/UITheme");
//------------------------------------
     let _                  = brackets.getModule("thirdparty/lodash"),
        Mustache            = brackets.getModule("thirdparty/mustache/mustache"),
        ViewCommandHandlers = brackets.getModule("view/ViewCommandHandlers"),
        settingsTemplate    = brackets.getModule("text!htmlContent/themes-settings.html"),
        PreferencesManager  = brackets.getModule("preferences/PreferencesManager"),
        ExtensionUtils      = brackets.getModule('utils/ExtensionUtils'),
        prefs               = PreferencesManager.getExtensionPrefs("UIthemes"),
        EventDispatcher     = brackets.getModule("utils/EventDispatcher");
    
    // strings.THEME_SETTINGS = 'theme settings';
     let loadedThemes = {};

    const SYSTEM_DEFAULT_THEME = "Default";

    /**
     * Object with all default values that can be configure via the settings UI
     */
    const DEFAULTS = {
        autoUItheming: true,
        theme: SYSTEM_DEFAULT_THEME,
        lightTheme: "light-theme",
        darkTheme: "dark-theme",
        blurUI: false
    };

     
    /**
     * Cached html settings jQuery object for easier processing when opening the settings dialog
     */
    var $settings = $(settingsTemplete).addClass("themeSettings");

    /**
     * @private
     * Gets all the configurable settings that need to be loaded in the settings dialog
     *
     * @return {Object} a collection with all the settings
     */
     function getValues() {
        var result = {};

        Object.keys(DEFAULTS).forEach(function (key) {
            result[key] = prefs.get(key);
        });
        return result;
    }
    
    //-----------------------------------------
    
    function showDialogue() {  
      const currentSettings = getValues(),
            newSettings     = {},
            themes          = _.map(loadedThemes, function (theme) { return theme; });
        // Insert system default theme
        themes.unshift({
            displayName: Strings.SYSTEM_DEFAULT,
            name: SYSTEM_DEFAULT_THEME
        });
        
         themes.unshift({
            displayName: 'Phoenix Blue',
            name: 'blue'
        });
                 themes.unshift({
            displayName: 'Grazzy Green',
            name:'green'
        });
        
                 themes.unshift({
            displayName: 'Radient Red',
            name: 'red'
        });
        
        const template      = $("<div>").append($settings).html(),
                // inject theme options

            $template       = $(Mustache.render(template,
                {"settings": currentSettings, "themes": themes, "Strings": Strings}));

        // Select the correct theme.
        var $currentThemeOption = $template
            .find("[value='" + currentSettings.theme + "']");

        if ($currentThemeOption.length === 0) {
            $currentThemeOption = $template.find("[value='" + DEFAULTS.theme + "']");
        }
        $currentThemeOption.attr("selected", "selected");
       // alert (currentThemeOption);
        $template
            .find("[data-toggle=tab].default")
            .tab("show");

        $template
            .on("change", "[data-target='autoUItheming']", function () {
                var $target = $(this);
               //alert($target.val(1));
                var attr = $target.attr("data-target");
                var return_value = $target.is(":checked");
                newSettings[attr] = return_value;
                UITheme.enable_auto_UI_theming(return_value);
                UITheme.colour_man();
            })
        
         .on("change", "[data-target='blurUI']", function () {
                var $target = $(this);
               //alert($target.val(1));
                var attr = $target.attr("data-target");
                var return_value = $target.is(":checked");
                newSettings[attr] = return_value;
                UITheme.enable_blurUI(return_value);
                UITheme.colour_man();
            })
        
            .on("change", "select", function () {
                var $target = $(":selected", this);
                var attr = $target.attr("data-target");
                let choice = $target.val();
                //main.save_user_UItheme_selection( choice );
               //alert (choice);
               UITheme.colourize_handler(choice);
               setTimeout(UITheme.dark_handler, 400);
                if (attr) {
                    prefs.set(attr, choice);
                }
            });
        
        
        
    
        Dialogs.showModalDialogUsingTemplate($template).done(function (id) {
            var setterFn;

            if (id === "save") {
                // Go through each new setting and apply it
                Object.keys(newSettings).forEach(function (setting) {
                    if (DEFAULTS.hasOwnProperty(setting)) {
                        prefs.set(setting, newSettings[setting]);
                    } else {
                        // Figure out if the setting is in the ViewCommandHandlers, which means it is
                        // a font setting
                        setterFn = "set" + setting[0].toLocaleUpperCase() + setting.substr(1);
                        if (typeof ViewCommandHandlers[setterFn] === "function") {
                            ViewCommandHandlers[setterFn](newSettings[setting]);
                        }
                    }
                });
            } else if (id === "cancel") {
                // Make sure we revert any changes to theme selection
                prefs.set("UItheme", currentSettings.theme);
            }
        });
    }
    
    prefs.definePreference("autoUItheming", "boolean", DEFAULTS.autoUItheming, {
        description: Strings.AUTO_UI_THEMING
    });
    prefs.definePreference("blurUI", "boolean", DEFAULTS.blurUI, {
        description: Strings.BLUR_UI
    });
    
    EventDispatcher.makeEventDispatcher(exports);

    exports.showDialogue       = showDialogue;
    
    
    
    
    });
