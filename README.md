Mathus-phoenix-addon
====================

Some add-ons for phoenix and brackets.
The underlying objective is to improve the usability on non-traditional devices like tablets and mobile phones. And also to incorporate material design principles.

## Features ##

### Modernzie

* Increase menu item separation (to be more touch-friendly ).
* Rounded corners. 
* Animations (menu open animation, hover animation).

### Colourize 

* Added red, green, and blue palettes to change the status-bar color.

### Mobile ui 

* When the screen size is small (or gets resized to a small window) phoenix will switch to mobile mode automatically.
* Sidebar hides by default (in mobile mode).
* Opening sidebar won't trigger resizer (i.e, contents tab won't get crushed).
* Sidebar toggle icon appears only when in mobile mode.
* A global variable to track the current state. ( mobile mode or normal mode).

Ps:: the current implementation of mobile UI is a bit hacky, use it at your own risk.

## Bugs ##

auto ui theming is broken for now

## Todo ##

* Better integration with the phoenix code base.
* Add more color palettes.
* ~~Detect and handle dark mode.~~
* ~~Move all color palettes to a sub-menu.~~
* ~~Better handling of live preview window in mobile mode.~~
* clean up style sheet and find a way to load variables from the brackets default sheet.
* Add more features.

## Getting Started ##

will be added soon...

## How to use ##

view menu > UI Theme Settings

View menu > Modernize (enable modernize options)

View menu > Colourize (enable colourize and set  default colour (blue))

View menu > Colourize red palette ( change to red color)

View menu > Colourize green palette ( change to green color)
 
 ## Change log ##
 
### 19-08-2022 initial release

### 02-09-2022 update 
- Theme the UI based on text colour or bg colour.
- Colours now transition smoothly.
- New dark theme handler.

### 10-09-2022 update
- better code organization.
- added a context menu for ui theming.
- color_man updates.

### 30-03-2023 update
- better code organization.
- massive code re-write.
- blur ui (only for context menu for now)
