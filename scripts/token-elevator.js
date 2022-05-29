// Module scope variables, used by multiple functions
let baseElevation = 0; // Default base elevation
let standardTick = 5; // Default standard elevation change tick
let largeTick = 10; // Default large elevation change tick
let hoveredTokens; // Pointer to affected tokens

// Change token elevation or reset to baseElevation, prefer hovered tokens over selected
async function setElevation(elevationChange) {
  const tokens = hoveredTokens ?? canvas.tokens.controlled; // hovered or selected?
  const updates = tokens.map((token) => ({
    _id: token.id,
    elevation: elevationChange === 0 ? 0 : token.data.elevation + elevationChange,
  }));
  await canvas.scene.updateEmbeddedDocuments("Token", updates);
  // Force token HUD to re-render, to make its elevation input show the new height
  if (canvas.hud.token.rendered) {
    canvas.hud.token.render();
  }
}

// Register settings and set defaults
async function setSettings() {
  const preSets = [
    {id: "bt", name: game.i18n.localize("te.settings.base"), default: baseElevation},
    {id: "st", name: game.i18n.localize("te.settings.standard"), default: standardTick},
    {id: "lt", name: game.i18n.localize("te.settings.large"), default: largeTick},
  ];
  // Set up all the above settings in one loop
  for (const set of preSets) {
    game.settings.register("token-elevator", `te-${set.id}`, {
      name: set.name,
      hint: game.i18n.localize("te.settings.hint"),
      scope: "world",
      config: true,
      type: Number,
      default: set.default,
      onChange: foundry.utils.debounce(() => window.location.reload(), 100),
    });
  }
}

// Register keybindings and set defaults
async function setKeybindings() {
  const resetText = game.i18n.localize("te.keybindings.resetText");
  const changeText = game.i18n.localize("te.keybindings.changeText");
  const uniKey = "IntlBackslash"; // Default single key for everything
  const preKeys = [
    {id: 0, name: resetText, elevationChange: baseElevation, preKeys: uniKey, keyMod: ["Control", "Alt", "Shift"]},
    {id: 1, name: changeText, elevationChange: standardTick, preKeys: uniKey, keyMod: []},
    {id: -1, name: changeText, elevationChange: -standardTick, preKeys: uniKey, keyMod: ["Control"]},
    {id: 2, name: changeText, elevationChange: largeTick, preKeys: uniKey, keyMod: ["Shift"]},
    {id: -2, name: changeText, elevationChange: -largeTick, preKeys: uniKey, keyMod: ["Control", "Shift"]},
  ];
  // Set up all the above keybindings in one loop
  for (const key of preKeys) {
    game.keybindings.register("token-elevator", `te-${key.id}`, {
      name: `${key.name + key.elevationChange}`,
      // hint: "Change token elevation of hovered or selected tokens.",
      editable: [{key: key.preKeys, modifiers: key.keyMod}],
      onDown: () => {
        setElevation(key.elevationChange); // call to change token elevation
        return true;
      },
    });
  }
}

Hooks.on("i18nInit", () => {
  // Register all module settings and set default
  setSettings();
  setKeybindings();
  // Take over custom user settings
  baseElevation = game.settings.get("token-elevator", "te-bt");
  standardTick = game.settings.get("token-elevator", "te-st");
  largeTick = game.settings.get("token-elevator", "te-lt");
});

// Track which token is currently being hovered on, or set to null if none
Hooks.on("hoverToken", (token, hovered) => {
  hoveredTokens = hovered ? [token] : null;
});

// Allow the mousewheel to change the value of the token HUD elevation input
Hooks.on("renderTokenHUD", () => {
  $(".elevation").on("wheel", (catchEvent) => {
    const originalEvent = catchEvent.originalEvent;
    const elevationChange = originalEvent.shiftKey ? largeTick : standardTick;
    const sign = originalEvent.wheelDelta > 0 ? 1 : -1;
    setElevation(elevationChange * sign);
  });
});
