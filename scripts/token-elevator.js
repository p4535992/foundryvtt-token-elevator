// Module scope variables, used by multiple functions
let hoveredTokens;
let baseElev = 0; // Default base elevation
let standardTick = 5; // Default standard elevation change tick
let largeTick = 10; // Default large elevation change tick

// Change token elevation or reset to 0, prefer hovered tokens over selected
async function setElevation(value) {
  const tokens = hoveredTokens ?? canvas.tokens.controlled; // hovered or selected?
  const updates = tokens.map((token) => ({
    _id: token.id,
    elevation: value === 0 ? 0 : token.data.elevation + value,
  }));
  await canvas.scene.updateEmbeddedDocuments("Token", updates);
  // Force token HUD to re-render, so that its elevation input shows the new height
  if (canvas.hud.token.rendered) {
    canvas.hud.token.render();
  }
}

// Register settings and set defaults
async function setSettings() {
  const preSets = [
    {id: "bt", name: "Base elevation level", default: baseElev},
    {id: "st", name: "Standard elevation change", default: standardTick},
    {id: "lt", name: "Large elevation change", default: largeTick},
  ];
  // Set up all the above settings in one loop
  for (const set of preSets) {
    game.settings.register("token-elevator", `te-${set.id}`, {
      name: set.name,
      hint: "Browser will reload when settings are saved!",
      scope: "world",
      config: true,
      type: Number,
      default: set.default,
      onChange: foundry.utils.debounce(() => window.location.reload(), 100),
    });
  }
  standardTick = game.settings.get("token-elevator", "te-st");
  largeTick = game.settings.get("token-elevator", "te-lt");
  baseElev = game.settings.get("token-elevator", "te-bt");
}

// Register keybindings and set defaults
async function setKeybindings() {
  const cTxt = "Change token elevation by";
  const rTxt = "Reset token elevation to";
  const uniKey = "IntlBackslash"; // Default single key for everything
  const preKeys = [
    {id: 0, name: rTxt, elevChg: baseElev, preKeys: uniKey, keyMod: ["Control", "Alt", "Shift"]},
    {id: 1, name: cTxt, elevChg: standardTick, preKeys: uniKey, keyMod: []},
    {id: -1, name: cTxt, elevChg: -standardTick, preKeys: uniKey, keyMod: ["Control"]},
    {id: 2, name: cTxt, elevChg: largeTick, preKeys: uniKey, keyMod: ["Shift"]},
    {id: -2, name: cTxt, elevChg: -largeTick, preKeys: uniKey, keyMod: ["Control", "Shift"]},
  ];
  // Set up all the above keybindings in one loop
  for (const key of preKeys) {
    game.keybindings.register("token-elevator", `te-${key.id}`, {
      name: `${key.name} ${key.elevChg}`,
      //      hint: "Change token elevation of hovered or selected tokens.",
      editable: [{key: key.preKeys, modifiers: key.keyMod}],
      onDown: () => {
        setElevation(key.elevChg); // call to change token elevation
        event.preventDefault();
      },
    });
  }
}

Hooks.on("init", () => {
  // Register all module settings and set default
  setSettings();
  setKeybindings();
});

// Track which token is currently being hovered on, or set to null if none
Hooks.on("hoverToken", (token, hovered) => {
  hoveredTokens = hovered ? [token] : null;
});

// Allow the mousewheel to change the value of the token HUD elevation input
Hooks.on("renderTokenHUD", () => {
  $(".elevation").on("wheel", (catchEvent) => {
    const originalEvent = catchEvent.originalEvent;
    const elevChg = originalEvent.shiftKey ? largeTick : standardTick;
    const sign = originalEvent.wheelDelta > 0 ? 1 : -1;
    setElevation(elevChg * sign);
  });
});
