import React from "react";
import { AbsoluteFill, Sequence, useVideoConfig } from "remotion";
import { Explainer, type ExplainerProps } from "./Explainer";
import { CatNarrator, type MascotCue } from "./components/CatNarrator";
import { resolveMascotCues } from "./components/cat-narrator-cues.mjs";

export interface LetCatTellProps extends ExplainerProps {
  mascotCues?: MascotCue[];
}

export const LetCatTell: React.FC<LetCatTellProps> = ({ mascotCues, ...explainerProps }) => {
  const { fps } = useVideoConfig();
  const cues = resolveMascotCues(mascotCues?.map((cue) => ({
    ...cue,
    position: cue.position ?? "right",
    entrance: cue.entrance ?? "pop",
  }))) as MascotCue[];

  return (
    <AbsoluteFill>
      <Explainer {...explainerProps} />
      {cues.map((cue, index) => (
        <Sequence
          key={`${cue.inSeconds}-${index}`}
          from={Math.round(cue.inSeconds * fps)}
          durationInFrames={Math.max(1, Math.round((cue.outSeconds - cue.inSeconds) * fps))}
        >
          <CatNarrator
            expression={cue.expression}
            position={cue.position}
            entrance={cue.entrance}
          />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
