## Token Elevator
Foundry VTT module: Change token elevation via hotkeys and mouse-wheel, priotizing hovered tokens over selected.

## Usage
- Hover the mouse-pointer over a token and press the hotkeys to change its elevation in steps of +-5 or +-10.
- Use the hotkeys to change elevation of all selected tokens while your mouse-pointer does *not* hover over a specific token.
- Open a token's HUD and use the mouse-wheel over the elevation field to change the elevation of all selected tokens by +-5, press shift for +-10.   

## Known issues
- Default keybind for resetting token elevation to 0 uses ALT modifier, which conflicts with Foundry's default for "Highlight Objects", because the latter messes with hover on detection.

## Future plans
- Localization.
- Mouse-wheel changes via token mouse-over instead of having to use the token HUD.
- Code optimizations once I gained more experience in Javascript and the various APIs (this is my first foray into all of this).

## Credits
Most of this module's code was made possible by contributions of the Foundry VTT Discord channel #module-development, especially @Freeze, @Varriount and @ghost and others. 

## License
MIT No Attribution

Copyright 2022 Weissrolf

Permission is hereby granted, free of charge, to any person obtaining a copy of this
software and associated documentation files (the "Software"), to deal in the Software
without restriction, including without limitation the rights to use, copy, modify,
merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
