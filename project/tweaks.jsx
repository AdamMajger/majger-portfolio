// Tweaks panel

function Tweaks({ tweaks, setTweak }) {
  return (
    <TweaksPanel title="Tweaks">
      <TweakSection label="Accent">
        <TweakColor
          label="Accent"
          value={tweaks.accent}
          onChange={(v) => setTweak("accent", v)}
          options={["#e8ff3a", "#f5d020", "#ff5a3a", "#e3e0d8"]}
        />
      </TweakSection>

      <TweakSection label="Background">
        <TweakColor
          label="Page bg"
          value={tweaks.background}
          onChange={(v) => setTweak("background", v)}
          options={["#0e0d0c", "#000000", "#16140f", "#1a1a1c"]}
        />
      </TweakSection>

      <TweakSection label="Grid">
        <TweakRadio
          label="Density"
          value={tweaks.density}
          onChange={(v) => setTweak("density", v)}
          options={[
            { value: "comfortable", label: "Comfy" },
            { value: "dense",       label: "Dense" },
          ]}
        />
        <TweakToggle
          label="Card captions"
          value={tweaks.showCaptions}
          onChange={(v) => setTweak("showCaptions", v)}
        />
      </TweakSection>
    </TweaksPanel>
  );
}

Object.assign(window, { Tweaks });
