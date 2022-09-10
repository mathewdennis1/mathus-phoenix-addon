// this is a place holder 
// all mobile functions will be moved here eventually.
  //mobile ui part-----------


define(function (require, exports, module) {
    'use strict';
    
     // Get dependencies.
     var   SidebarView = brackets.getModule('project/SidebarView'),
           ExtensionUtils = brackets.getModule('utils/ExtensionUtils');

    
    // load mobile stylesheet 
    ExtensionUtils.loadStyleSheet(module, 'mobile-styles.css');


    
    
    
    //setup a global lookup variable..
    // this will be set later by resize observer
    let UI_mode = 'init-mode';
    function mode() {alert(UI_mode);return UI_mode;}
    
    
    // setup functions..
    function enable_mobileUI() {
        // add a new  plugin bar entryS
        $(document.createElement('a'))
            .attr('id', 'navbar-toggle-icon')
            .attr('href', '#')
            .attr('title', 'Toggle navbar')
            .on('click', function () {
                toggleSidebar();
            })
            .appendTo($('#main-toolbar .buttons'));

        UI_mode = 'mobile';
        SidebarView.hide();

    }

    function disable_mobileUI() {
        const mobileUI_plugin_icon = document.getElementById('navbar-toggle-icon');
        mobileUI_plugin_icon.remove();
        UI_mode = 'bigScreen';
        // use phoenix sidebar show function    
        SidebarView.show();
        return exports.status > UI_mode;


    }

    // The default class for side bar is "sidebar panel quiet-scrollbars horz-resizable right-resizer collapsible".
    // We create 2 aditional classes and use them to swich between open and close states.
    // It is possible to do the same with  SidebarView function ,but this way we get a cool animation.

    function toggleSidebar() {
        const element = document.getElementById("sidebar");
        const style_sidebarOpen = "sidebar panel quiet-scrollbars horz-resizable right-resizer collapsible sidebar-open";
        const style_sidebarClose = "sidebar panel quiet-scrollbars horz-resizable right-resizer collapsible sidebar-close";

        if (element.className != style_sidebarOpen) {
            element.className = style_sidebarOpen;
            SidebarView.show();
        } else if (element.className == style_sidebarOpen) {
            element.className = style_sidebarClose;
            SidebarView.hide();
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
    
    
      // Status Codes
        exports.mode       = mode;

    
});