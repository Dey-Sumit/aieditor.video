import { type AnnotationHandler, InnerLine } from "codehike/code";
import { interpolate, interpolateColors, useCurrentFrame } from "remotion";
import { z } from "zod";

const DEFAULT_COLOR = "rgba(236, 72, 153, 0.2)";
const DEFAULT_BORDER_COLOR = "rgba(236, 72, 153, 1)";

const colorSchema = z
  .string()
  .regex(/^(#|rgb|rgba|hsl|hsla)/)
  .transform((color) => ({
    background: color,
    border: color.replace(/,[^,]*\)/, ",1)"), // Convert to solid color for border
  }))
  .catch({
    background: DEFAULT_COLOR,
    border: DEFAULT_BORDER_COLOR,
  });

export const mark: AnnotationHandler = {
  name: "mark",
  AnnotatedLine: ({ annotation, ...props }) => {
    const parts = annotation.query.split(" ");
    const delay = +parts[0] || 80;
    const duration = +parts[1] || 20;
    const colors = colorSchema.parse(parts[2]);

    const frame = useCurrentFrame();
    const progress = interpolate(frame, [delay, delay + duration], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

    const backgroundColor = interpolateColors(
      progress,
      [0, 1],
      ["rgba(0, 0, 0, 0)", colors.background],
    );

    const borderColor = interpolateColors(
      progress,
      [0, 1],
      ["rgba(236, 72, 153, 0)", colors.border],
    );

    return (
      <div
        {...props}
        style={{
          backgroundColor,
          borderRadius: 4,
          padding: "0.25rem 1rem",
          margin: "-0.25px -.125rem",
          borderLeft: `2px solid ${borderColor}`,
        }}
      >
        <InnerLine merge={props} className="mark" />
      </div>
    );
  },
  Line: (props) => {
    return <InnerLine merge={props} className="..." />;
  },
  Inline: ({ children, annotation }) => {
    const parts = annotation.query.split(" ");
    const delay = +parts[0] || 80;
    const duration = +parts[1] || 20;
    const colors = colorSchema.parse(parts[2]);

    const frame = useCurrentFrame();
    const progress = interpolate(frame, [delay, delay + duration], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

    const backgroundColor = interpolateColors(
      progress,
      [0, 1],
      ["rgba(0, 0, 0, 0)", colors.background],
    );

    const borderColor = interpolateColors(
      progress,
      [0, 1],
      ["rgba(236, 72, 153, 0)", colors.border],
    );

    return (
      <div
        style={{
          display: "inline-block",
          backgroundColor,
          borderRadius: 4,
          padding: "0.25rem 0.75rem",
          margin: "0 -.125rem",
          border: `2px solid ${borderColor}`,
        }}
      >
        {children}
      </div>
    );
  },
};
