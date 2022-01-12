let hoveredTokens; // In module scope for checking which token is hovered on

// Change token elevation or reset to 0, prefer hovered tokens over selected
async function setElevation(value) {
  const tokens = hoveredTokens ?? canvas.tokens.controlled; // hovered or selected?
  const updates = tokens.map(function (token) {
    return {
      _id: token.id,
      elevation: value === 0 ? 0 : token.data.elevation + value,
    };
  });
  await canvas.scene.updateEmbeddedDocuments("Token", updates);

  // Force token HUD to re-render, so that its elevation input shows the new height
  if (canvas.hud.token.rendered) {
    canvas.hud.token.render();
  }
}

// Set up default module keybindings
Hooks.on("init", () => {
  const unipreKey = "IntlBackslash"; // Default single key for everything
  const preKeys = [
    { change: -10, preKeys: unipreKey, keyMod: ["Control", "Shift"] },
    { change: -5, preKeys: unipreKey, keyMod: ["Control"] },
    { change: 0, preKeys: unipreKey, keyMod: ["Alt", "Shift"] },
    { change: 5, preKeys: unipreKey, keyMod: [] },
    { change: 10, preKeys: unipreKey, keyMod: ["Shift"] },
  ];

  // Set up all the above keybindings in one loop
  for (const key of preKeys) {
    game.keybindings.register("token-elevator", `te${key.change}`, {
      name: `Change token elevation by ${key.change}`,
      hint: "Change token elevation of hovered or selected tokens.",
      editable: [{ key: key.preKeys, modifiers: key.keyMod }],
      onDown: () => {
        setElevation(key.change); // call to change token elevation
      },
    });
  }
});

// Track which token is currently being hovered over
Hooks.on("hoverToken", function (token, hovered) {
  hoveredTokens = hovered ? [token] : null;
});

// Allow the mousewheel to change the value of the token HUD elevation input
Hooks.on("renderTokenHUD", () => {
  $(".elevation").on("wheel", (catchEvent) => {
    const originalEvent = catchEvent.originalEvent;
    const value = originalEvent.shiftKey ? 10 : 5;
    const sign = originalEvent.wheelDelta > 0 ? 1 : -1;

    setElevation(value * sign);
  });
});
