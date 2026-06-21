# Nong Som Narrator Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a reusable vertical Remotion composition whose default output always includes the canonical Nong Som digital orange-cat narrator.

**Architecture:** Keep the existing generic `Explainer` unchanged. Add one pure cue resolver, one visual `CatNarrator` component, and one `LetCatTell` composition that layers the existing explainer beneath the narrator and captions above it.

**Tech Stack:** React 18, Remotion 4, TypeScript 5, Node built-in test runner.

## Global Constraints

- The channel composition is 1080x1920 at 30fps.
- Nong Som is drawn procedurally; use no remote or generated character asset.
- All mascot motion is frame based; no CSS animation or transition.
- The generic `Explainer` composition retains its current output and defaults.
- Adjacent mascot cues cannot resolve to the same expression.
- The existing repository TypeScript check has unrelated diagnostics; no diagnostic may name a Nong Som file.

---

### Task 1: Define and test cue resolution

**Files:**
- Create: `remotion-composer/src/components/cat-narrator-cues.mjs`
- Create: `remotion-composer/tests/cat-narrator-cues.test.mjs`

**Interfaces:**
- Produces: `CAT_EXPRESSIONS`, `DEFAULT_MASCOT_CUES`, and `resolveMascotCues(cues)`.
- Consumes: plain timed cue records from `LetCatTell`.

- [x] **Step 1: Write the failing test**

```js
test("replaces an adjacent duplicate expression", () => {
  const cues = resolveMascotCues([
    { inSeconds: 0, outSeconds: 2, expression: "curious" },
    { inSeconds: 2, outSeconds: 4, expression: "curious" },
  ]);
  assert.equal(cues[1].expression, "interested");
});
```

- [x] **Step 2: Run test to verify it fails**

Run: `node --test remotion-composer/tests/cat-narrator-cues.test.mjs`
Expected: FAIL because the module does not exist.

- [x] **Step 3: Write minimal implementation**

```js
export const resolveMascotCues = (cues) => cues.map((cue, index) => ({
  ...cue,
  expression: index > 0 && cue.expression === cues[index - 1].expression
    ? "interested"
    : cue.expression,
}));
```

- [x] **Step 4: Run test to verify it passes**

Run: `node --test remotion-composer/tests/cat-narrator-cues.test.mjs`
Expected: no diagnostic names `CatNarrator.tsx` or `LetCatTell.tsx` (the repository has unrelated baseline diagnostics).

### Task 2: Build canonical visual component

**Files:**
- Create: `remotion-composer/src/components/CatNarrator.tsx`
- Modify: `remotion-composer/src/components/index.ts`

**Interfaces:**
- Consumes: `expression`, `position`, and `entrance` from a resolved mascot cue.
- Produces: `CatNarrator` and its exported `CatExpression`/`MascotCue` types.

- [x] **Step 1: Extend the failing type check**

Add a `CatNarrator` import and render it in the new composition in Task 3.

- [x] **Step 2: Run type check to verify it fails**

Run: `cd remotion-composer && npx tsc --noEmit`
Expected: FAIL because `CatNarrator` is not exported.

- [x] **Step 3: Write minimal implementation**

Use an SVG/HTML cat with fixed orange palette and expression-specific eyes/mouth. Drive blink, ear, tail, head, and entrance transforms from `useCurrentFrame()`, `useVideoConfig()`, `interpolate()`, and `spring()`.

- [x] **Step 4: Run type check to verify it passes**

Run: `cd remotion-composer && npx tsc --noEmit`
Expected: no diagnostic names `CatNarrator.tsx` or `LetCatTell.tsx`; the preview render is the executable acceptance check.

### Task 3: Add the channel-specific vertical composition

**Files:**
- Create: `remotion-composer/src/LetCatTell.tsx`
- Modify: `remotion-composer/src/Root.tsx`

**Interfaces:**
- Consumes: `ExplainerProps` plus optional `mascotCues`.
- Produces: `LetCatTell` composition id with fixed `1080x1920`, `30fps`, and a default Nong Som cue.

- [x] **Step 1: Write the failing type check**

Register `LetCatTell` in `Root.tsx` before creating its module.

- [x] **Step 2: Run type check to verify it fails**

Run: `cd remotion-composer && npx tsc --noEmit`
Expected: FAIL because `./LetCatTell` is missing.

- [x] **Step 3: Write minimal implementation**

Render `Explainer` in an `AbsoluteFill`, then map resolved timed cues to `Sequence` instances containing `CatNarrator`. Register the composition with 1080x1920 dimensions and default props containing a first `interested` cue.

- [x] **Step 4: Run type check and preview render**

Run: `cd remotion-composer && npx tsc --noEmit && npx remotion still src/index.tsx LetCatTell /tmp/nong-som-preview.png`
Expected: PASS and a vertical PNG with Nong Som present.

### Task 4: Verify the complete behaviour

**Files:**
- Verify: `remotion-composer/tests/cat-narrator-cues.test.mjs`
- Verify: `remotion-composer/src/Root.tsx`

- [x] **Step 1: Run all local Node tests**

Run: `node --test remotion-composer/tests/*.test.mjs`
Expected: no diagnostic names `CatNarrator.tsx` or `LetCatTell.tsx`; the repository has unrelated baseline diagnostics.

- [x] **Step 2: Run TypeScript validation**

Run: `cd remotion-composer && npx tsc --noEmit`
Expected: PASS.

- [x] **Step 3: Inspect the preview**

Confirm the orange cat is fully inside the 9:16 frame, above the caption area, and retains the same palette and silhouette at the default cue.
