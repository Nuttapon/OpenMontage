# Nong Som Narrator Design

## Goal

Add a reusable, recognisable digital orange-cat narrator for the `ให้แมวเล่า` short-form channel. Every channel render uses the same canonical character while varying only its cue-driven performance.

## Scope

- Create a dedicated vertical Remotion composition for `ให้แมวเล่า`; do not alter the generic `Explainer` composition's default output.
- Draw Nong Som procedurally as a 2D SVG/HTML character so its face, colours, and silhouette are identical in every render.
- Support eight story-driven reactions: interested, curious, shocked, amused, thinking, knowing, excited, and summary.
- Use compact frame-based entrances and idle movement (blink, ear twitch, tail sway, head turn, bounce) at 30fps.
- Keep the cat clear of captions by reserving the upper and mid-screen safe areas; captions remain in their existing lower-screen layer.

## Non-goals

- No generated raster mascot variants, voice synthesis, lip sync, asset service, or new video pipeline.
- No change to unrelated OpenMontage compositions or existing render defaults.

## Architecture

`CatNarrator` is the sole visual implementation of the canonical character. A small pure cue resolver maps an optional scene cue to one of the approved expressions and rejects immediate repeats by falling back to `interested`. `LetCatTell` composes the existing `Explainer` beneath the narrator and receives a short `mascotCues` list with timing, expression, placement, and entrance.

The component is procedural and frame based: it relies exclusively on Remotion hooks, `interpolate`, and `spring`; no CSS animations or external character assets are used. The same silhouette, palette, and face proportions therefore render identically across every video.

## Contract

```ts
type CatExpression =
  | "interested" | "curious" | "shocked" | "amused"
  | "thinking" | "knowing" | "excited" | "summary";

type MascotCue = {
  inSeconds: number;
  outSeconds: number;
  expression: CatExpression;
  position?: "left" | "right" | "center";
  entrance?: "pop" | "slide";
};
```

When no cue list is supplied, `LetCatTell` supplies a short default cue at the start so the channel identity is still present. Supplied cue lists must be sequenced by the edit plan and must not use the same expression in adjacent cues.

## Verification

- Node tests prove cue fallback and adjacent-expression de-duplication.
- Remotion bundles and renders the composition; the repository's existing TypeScript diagnostics must not include a Nong Som file.
- Remotion renders a vertical preview using the composition's default props.
