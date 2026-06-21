export const CAT_EXPRESSIONS = [
  "interested",
  "curious",
  "shocked",
  "amused",
  "thinking",
  "knowing",
  "excited",
  "summary",
];

export const DEFAULT_MASCOT_CUES = [
  {
    inSeconds: 0,
    outSeconds: 2.4,
    expression: "interested",
    position: "right",
    entrance: "pop",
  },
];

export const resolveMascotCues = (cues = DEFAULT_MASCOT_CUES) => {
  return cues.reduce((resolved, cue) => {
    const requestedExpression = CAT_EXPRESSIONS.includes(cue.expression)
      ? cue.expression
      : "interested";
    const previousExpression = resolved.at(-1)?.expression;
    const expression = requestedExpression === previousExpression
      ? previousExpression === "interested" ? "curious" : "interested"
      : requestedExpression;

    resolved.push({
      ...cue,
      expression,
      position: cue.position ?? "right",
      entrance: cue.entrance ?? "pop",
    });
    return resolved;
  }, []);
};
