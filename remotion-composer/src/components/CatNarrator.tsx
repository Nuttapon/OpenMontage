import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
export type CatExpression =
  | "interested"
  | "curious"
  | "shocked"
  | "amused"
  | "thinking"
  | "knowing"
  | "excited"
  | "summary";

export interface MascotCue {
  inSeconds: number;
  outSeconds: number;
  expression: CatExpression;
  position?: "left" | "right" | "center";
  entrance?: "pop" | "slide";
}

type CatNarratorProps = Pick<MascotCue, "expression" | "position" | "entrance">;

const expressionFaces: Record<CatExpression, { eyeY: number; mouth: string; brow?: string }> = {
  interested: { eyeY: 0, mouth: "M 142 198 Q 170 213 198 198" },
  curious: { eyeY: -4, mouth: "M 145 201 Q 170 211 195 201", brow: "M 130 154 Q 145 143 158 151" },
  shocked: { eyeY: 0, mouth: "M 160 199 Q 170 187 180 199 Q 170 216 160 199" },
  amused: { eyeY: 5, mouth: "M 139 195 Q 170 224 201 195" },
  thinking: { eyeY: 2, mouth: "M 150 202 Q 169 193 190 202", brow: "M 130 150 Q 146 140 158 149" },
  knowing: { eyeY: 5, mouth: "M 141 195 Q 170 220 199 195", brow: "M 183 149 Q 196 139 210 150" },
  excited: { eyeY: -2, mouth: "M 138 193 Q 170 228 202 193" },
  summary: { eyeY: 3, mouth: "M 145 198 Q 170 216 195 198" },
};

export const CatNarrator: React.FC<CatNarratorProps> = ({
  expression,
  position = "right",
  entrance = "pop",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const face = expressionFaces[expression];
  const entranceProgress = spring({ frame, fps, config: { damping: 14, stiffness: 170, mass: 0.7 } });
  const blink = frame % Math.round(fps * 4) < 3 ? 0.16 : 1;
  const tailAngle = Math.sin(frame / (fps * 0.35)) * 11;
  const earAngle = Math.sin(frame / (fps * 1.9)) * 3;
  const bob = Math.sin(frame / (fps * 0.65)) * 5;
  const scale = interpolate(entranceProgress, [0, 1], [0.72, 1]);
  const slideX = entrance === "slide"
    ? interpolate(entranceProgress, [0, 1], [position === "left" ? -120 : 120, 0])
    : 0;
  const horizontal = position === "left" ? { left: 28 } : position === "center" ? { left: "50%", marginLeft: -170 } : { right: 28 };

  return (
    <div
      style={{
        position: "absolute",
        bottom: 350,
        width: 340,
        height: 340,
        ...horizontal,
        transform: `translateX(${slideX}px) translateY(${bob}px) scale(${scale})`,
        transformOrigin: "bottom center",
      }}
    >
      <svg viewBox="0 0 340 340" width="340" height="340" aria-label="Nong Som, the orange digital cat narrator">
        <ellipse cx="173" cy="303" rx="116" ry="19" fill="rgba(30, 41, 59, 0.25)" />
        <path d="M 246 264 C 317 273 314 192 271 211" fill="none" stroke="#F97316" strokeWidth="34" strokeLinecap="round" transform={`rotate(${tailAngle} 246 264)`} />
        <path d="M 245 264 C 301 270 302 216 272 225" fill="none" stroke="#FDBA74" strokeWidth="10" strokeLinecap="round" transform={`rotate(${tailAngle} 246 264)`} />
        <ellipse cx="170" cy="253" rx="98" ry="72" fill="#F97316" stroke="#7C2D12" strokeWidth="9" />
        <path d="M 89 168 L 101 82 L 151 136 Z" fill="#FB923C" stroke="#7C2D12" strokeWidth="9" transform={`rotate(${-earAngle} 120 145)`} />
        <path d="M 251 168 L 239 82 L 189 136 Z" fill="#FB923C" stroke="#7C2D12" strokeWidth="9" transform={`rotate(${earAngle} 220 145)`} />
        <path d="M 105 128 L 110 105 L 131 136 Z" fill="#FDE68A" />
        <path d="M 235 128 L 230 105 L 209 136 Z" fill="#FDE68A" />
        <circle cx="170" cy="170" r="94" fill="#FB923C" stroke="#7C2D12" strokeWidth="9" />
        <path d="M 103 159 C 120 143 140 139 151 151" fill="none" stroke="#9A3412" strokeWidth="12" strokeLinecap="round" />
        <path d="M 237 159 C 220 143 200 139 189 151" fill="none" stroke="#9A3412" strokeWidth="12" strokeLinecap="round" />
        {face.brow && <path d={face.brow} fill="none" stroke="#7C2D12" strokeWidth="8" strokeLinecap="round" />}
        <ellipse cx="138" cy={169 + face.eyeY} rx="18" ry={27 * blink} fill="#1E293B" />
        <ellipse cx="202" cy={169 + face.eyeY} rx="18" ry={27 * blink} fill="#1E293B" />
        <circle cx="143" cy={162 + face.eyeY} r="5" fill="#FFF7ED" opacity={blink} />
        <circle cx="207" cy={162 + face.eyeY} r="5" fill="#FFF7ED" opacity={blink} />
        <path d="M 163 183 L 177 183 L 170 192 Z" fill="#7C2D12" />
        <path d={face.mouth} fill="none" stroke="#7C2D12" strokeWidth="8" strokeLinecap="round" />
        <path d="M 114 189 L 71 181 M 114 199 L 67 208 M 226 189 L 269 181 M 226 199 L 273 208" stroke="#7C2D12" strokeWidth="6" strokeLinecap="round" />
        <path d="M 134 238 Q 170 252 206 238" fill="none" stroke="#FDBA74" strokeWidth="10" strokeLinecap="round" />
      </svg>
    </div>
  );
};
