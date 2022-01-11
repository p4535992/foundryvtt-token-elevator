let hoveredToken // in module scope for checking which token is hovered on

// change token elevation or reset to 0, prefer hovered tokens over selected
async function setElevation (value) {
  const tokens = hoveredToken ?? canvas.tokens.controlled // hovered or selected?
  const updates = tokens.map((token) => ({
    _id: token.id,
    elevation: value === 0 ? 0 : token.data.elevation + value
  }))
  await canvas.scene.updateEmbeddedDocuments("Token", updates)
  // force tokenHUD re-render to update its elevation input dialog on key changes
  if (canvas.hud.token.rendered) canvas.hud.token.render()
}

// set up default module keybindings
Hooks.on("init", () => {
  const unipreKey = "IntlBackslash" // default single key for everything
  const preKeys = [
    { change: -10, preKeys: unipreKey, keyMod: ["Control", "Shift"] },
    { change: -5, preKeys: unipreKey, keyMod: ["Control"] },
    { change: 0, preKeys: unipreKey, keyMod: ["Alt", "Shift"] },
    { change: 5, preKeys: unipreKey, keyMod: [] },
    { change: 10, preKeys: unipreKey, keyMod: ["Shift"] }
  ]
  // set up all the above keybindings in one loop
  for (const key of preKeys) {
    game.keybindings.register("token-elevator", `te${key.change}`, {
      name: `Change token elevation by ${key.change}`,
      hint: "Change token elevation of hovered or selected tokens.",
      editable: [{ key: key.preKeys, modifiers: key.keyMod }],
      onDown: () => {
        setElevation(key.change) // call to change token elevation
      }
    })
  }
})

// query if token is hovered on
Hooks.on("hoverToken", function (token, hovered) {
  hoveredToken = hovered ? [token] : null
})

// allow mousewheel to change value of tokenHUD elevation box
Hooks.on("renderTokenHUD", () => {
  $(".elevation").bind("wheel", (catchEvent) => {
    setElevation(
      catchEvent.originalEvent.wheelDelta > 0
        ? event.shiftKey // event. deprecated?
          ? 10
          : 5
        : event.shiftKey // event. depredated?
          ? -10
          : -5
    )
  })
})
