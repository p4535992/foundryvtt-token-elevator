# Token Elevator
Change token elevation via hotkeys and mouse-wheel, prioritizing hovered tokens over selected. Base elevation level and elevation change steps can be configured by the GM.

## Usage
- Hover the mouse-pointer over a token and press the hotkeys to change its elevation in standard or large steps.
- Use the hotkeys to change elevation of all selected tokens while your mouse-pointer does *not* hover over a specific token.
- Open a token's HUD and use the mouse-wheel over the elevation field to change the elevation of all selected tokens by standard steps, press shift for large steps.

The default hotkey is |\ on US/international keyboards and |<> on German ones.

## Preview (animated GIF)
![animated GIF](https://i.imgur.com/Pp3fA5R.gif)

## Known issues
- Default keybind for resetting token elevation to 0 uses ALT modifier, which conflicts with Foundry's default for "Highlight Objects", because the latter messes with hover on detection. Make sure to press a different modifier before pressing ALT.

## Changelog
See [CHANGELOG](./CHANGELOG.md) file for details.

## Future plans
- Localization.
- Mouse-wheel changes via token mouse-over instead of having to use the token HUD.
- Code optimizations once I gained more experience in Javascript and the various APIs (this is my first foray into all of this).

## Credits
Most of this module's code was made possible by the generous contributions of the Foundry VTT Discord channel #module-development. 

## License
MIT No Attribution

This is effectively "Public Domain". Magic, do as you will. See [LICENSE](./LICENSE) file for details.
