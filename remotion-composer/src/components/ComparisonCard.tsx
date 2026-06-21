import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadFont as loadNotoSansThai } from "@remotion/google-fonts/NotoSansThai";

const { fontFamily: thaiFontFamily } = loadNotoSansThai("normal", {
  weights: ["400", "600", "700", "800"],
  subsets: ["thai", "latin"],
});

// Thai needs a proper webfont with full glyph coverage (Inter ships no Thai
// glyphs, so it silently falls back to an inconsistent system font and clips
// tone marks). Default to Noto Sans Thai for correct rendering.
const DEFAULT_FONT_FAMILY = `${thaiFontFamily}, Inter, system-ui, sans-serif`;

// Relative luminance of a CSS color (#rgb/#rrggbb/rgb()/rgba()), used to pick
// label text that contrasts the *card* — the labels sit inside the light card,
// not over the video, so they must not inherit the white over-video text color.
const colorLuminance = (color: string): number => {
  let r = 255,
    g = 255,
    b = 255;
  const hex = color.trim().match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (hex) {
    let h = hex[1];
    if (h.length === 3) h = h.split("").map((c) => c + c).join("");
    r = parseInt(h.slice(0, 2), 16);
    g = parseInt(h.slice(2, 4), 16);
    b = parseInt(h.slice(4, 6), 16);
  } else {
    const m = color.match(/rgba?\(([^)]+)\)/i);
    if (m) {
      const parts = m[1].split(",").map((s) => parseFloat(s));
      [r, g, b] = parts;
    }
  }
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
};

type ChangeDirection = "up" | "down" | "neutral";

interface ComparisonCardProps {
  leftLabel: string;
  rightLabel: string;
  leftValue: string;
  rightValue: string;
  leftColor?: string;
  rightColor?: string;
  title?: string;
  changeIndicator?: string;
  changeDirection?: ChangeDirection;
  backgroundColor?: string;
  cardBackgroundColor?: string;
  textColor?: string;
  fontFamily?: string;
  titleFontSize?: number;
  labelFontSize?: number;
  valueFontSize?: number;
}

export const ComparisonCard: React.FC<ComparisonCardProps> = ({
  leftLabel,
  rightLabel,
  leftValue,
  rightValue,
  leftColor = "#2563EB",
  rightColor = "#10B981",
  title,
  changeIndicator,
  changeDirection = "neutral",
  backgroundColor = "#FFFFFF",
  cardBackgroundColor = "#F3F4F6",
  textColor = "#1F2937",
  fontFamily = DEFAULT_FONT_FAMILY,
  titleFontSize = 44,
  labelFontSize = 26,
  valueFontSize = 54,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Labels live inside the card, so contrast against the card, not the video.
  // (textColor is the over-video color and is often white — invisible here.)
  const cardIsLight = colorLuminance(cardBackgroundColor) > 0.55;
  const labelColor = cardIsLight ? "#475569" : "rgba(255,255,255,0.9)";

  // Phase 1: Title + left side appears
  const titleOpacity = spring({
    frame,
    fps,
    config: { damping: 20 },
  });

  const leftOpacity = spring({
    frame: frame - 6,
    fps,
    config: { damping: 18 },
  });
  const leftSlide = spring({
    frame: frame - 6,
    fps,
    config: { damping: 14, stiffness: 90 },
    from: -40,
    to: 0,
  });
  const leftScale = spring({
    frame: frame - 6,
    fps,
    config: { damping: 12, stiffness: 100 },
    from: 0.9,
    to: 1,
  });

  // Phase 2: Divider draws in (vertical line)
  const dividerDraw = spring({
    frame: frame - 16,
    fps,
    config: { damping: 14, stiffness: 80 },
  });

  // Phase 3: Right side appears
  const rightOpacity = spring({
    frame: frame - 24,
    fps,
    config: { damping: 18 },
  });
  const rightSlide = spring({
    frame: frame - 24,
    fps,
    config: { damping: 14, stiffness: 90 },
    from: 40,
    to: 0,
  });
  const rightScale = spring({
    frame: frame - 24,
    fps,
    config: { damping: 12, stiffness: 100 },
    from: 0.9,
    to: 1,
  });

  // Phase 4: Change indicator
  const indicatorOpacity = spring({
    frame: frame - 32,
    fps,
    config: { damping: 15 },
  });
  const indicatorScale = spring({
    frame: frame - 32,
    fps,
    config: { damping: 10, stiffness: 130 },
    from: 0.6,
    to: 1,
  });

  // Arrow glyph based on direction
  const directionArrow =
    changeDirection === "up"
      ? "\u2191"
      : changeDirection === "down"
        ? "\u2193"
        : "\u2194";
  const directionColor =
    changeDirection === "up"
      ? "#10B981"
      : changeDirection === "down"
        ? "#EF4444"
        : "#9CA3AF";

  return (
    <AbsoluteFill
      style={{
        background: backgroundColor,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "80%",
          maxWidth: 1540,
          gap: 32,
        }}
      >
        {/* Title */}
        {title && (
          <div
            style={{
              fontFamily,
              fontWeight: 700,
              fontSize: titleFontSize,
              color: textColor,
              textAlign: "center",
              opacity: titleOpacity,
              lineHeight: 1.3,
              letterSpacing: "-0.02em",
            }}
          >
            {title}
          </div>
        )}

        {/* Comparison container */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "stretch",
            width: "100%",
            borderRadius: 16,
            backgroundColor: cardBackgroundColor,
            // `visible` so Thai tone marks / long wrapped values are never
            // clipped by the rounded container; padding keeps text off corners.
            overflow: "visible",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            minHeight: 280,
            height: "auto",
          }}
        >
          {/* Left side */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              padding: "48px 32px",
              opacity: leftOpacity,
              transform: `translateX(${leftSlide}px) scale(${leftScale})`,
              gap: 16,
            }}
          >
            {/* Left color accent bar */}
            <div
              style={{
                width: 48,
                height: 4,
                backgroundColor: leftColor,
                borderRadius: 2,
                marginBottom: 8,
              }}
            />
            <div
              style={{
                fontFamily,
                fontWeight: 600,
                fontSize: labelFontSize,
                color: labelColor,
                lineHeight: 1.35,
                textAlign: "center" as const,
                letterSpacing: "0.02em",
              }}
            >
              {leftLabel}
            </div>
            <div
              style={{
                fontFamily,
                fontWeight: 800,
                fontSize: valueFontSize,
                color: leftColor,
                // Thai stacks vowels/tone marks above & below the base glyph;
                // 1.1 clips them. 1.34 gives the marks room on wrapped lines.
                lineHeight: 1.34,
                textAlign: "center" as const,
                overflowWrap: "break-word" as const,
                maxWidth: "100%",
              }}
            >
              {leftValue}
            </div>
          </div>

          {/* Center divider + change indicator */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              width: 80,
              position: "relative",
            }}
          >
            {/* Vertical divider line */}
            <div
              style={{
                width: 2,
                height: `${dividerDraw * 100}%`,
                backgroundColor: "#D1D5DB",
                position: "absolute",
                top: `${((1 - dividerDraw) / 2) * 100}%`,
              }}
            />

            {/* Change indicator badge */}
            {changeIndicator && (
              <div
                style={{
                  position: "relative",
                  zIndex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 4,
                  opacity: indicatorOpacity,
                  transform: `scale(${indicatorScale})`,
                }}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 24,
                    backgroundColor,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
                  }}
                >
                  <span
                    style={{
                      fontFamily,
                      fontWeight: 700,
                      fontSize: 24,
                      color: directionColor,
                    }}
                  >
                    {directionArrow}
                  </span>
                </div>
                <div
                  style={{
                    fontFamily,
                    fontWeight: 700,
                    fontSize: 18,
                    color: directionColor,
                    whiteSpace: "nowrap" as const,
                  }}
                >
                  {changeIndicator}
                </div>
              </div>
            )}
          </div>

          {/* Right side */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              padding: "48px 32px",
              opacity: rightOpacity,
              transform: `translateX(${rightSlide}px) scale(${rightScale})`,
              gap: 16,
            }}
          >
            {/* Right color accent bar */}
            <div
              style={{
                width: 48,
                height: 4,
                backgroundColor: rightColor,
                borderRadius: 2,
                marginBottom: 8,
              }}
            />
            <div
              style={{
                fontFamily,
                fontWeight: 600,
                fontSize: labelFontSize,
                color: labelColor,
                lineHeight: 1.35,
                textAlign: "center" as const,
                letterSpacing: "0.02em",
              }}
            >
              {rightLabel}
            </div>
            <div
              style={{
                fontFamily,
                fontWeight: 800,
                fontSize: valueFontSize,
                color: rightColor,
                lineHeight: 1.34,
                textAlign: "center" as const,
                overflowWrap: "break-word" as const,
                maxWidth: "100%",
              }}
            >
              {rightValue}
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
