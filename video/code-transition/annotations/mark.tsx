import { type AnnotationHandler, InnerLine } from "codehike/code";
import { interpolate, interpolateColors, useCurrentFrame } from "remotion";
/* export const mark: AnnotationHandler = {
  name: "mark",
  Inline: ({ children, annotation }) => {
    const parts = annotation.query.split(" ")
    console.log({ parts, annotation })

    const delay = +parts[0] || 80
    const duration = +parts[1] || 20
    const color = parts[2] || "rgba(236, 72, 153, 0.2)"

    const frame = useCurrentFrame()
    const progress = interpolate(frame, [delay, delay + duration], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })

    const backgroundColor = interpolateColors(
      progress,
      [0, 1],
      ["rgba(0, 0, 0, 0)", color]
    )

    const borderColor = interpolateColors(
      progress,
      [0, 1],
      ["rgba(236, 72, 153, 0)", "rgba(236, 72, 153, 1)"]
    )
    return (
      <div
        style={{
          display: "inline-block",
          backgroundColor,
          borderRadius: 4,
          padding: "0.25rem 1rem",
          margin: "0 -.125rem",
          border: `2px solid ${borderColor}`,
        }}
      >
        {children}
      </div>
    )
  },
}
 */
export const mark: AnnotationHandler = {
  name: "mark",
  AnnotatedLine: ({ annotation, ...props }) => {
    const parts = annotation.query.split(" ");

    const delay = +parts[0] || 80;
    const duration = +parts[1] || 20;
    const color = parts[2] || "rgba(236, 72, 153, 0.2)";

    const frame = useCurrentFrame();
    const progress = interpolate(frame, [delay, delay + duration], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

    const backgroundColor = interpolateColors(
      progress,
      [0, 1],
      ["rgba(0, 0, 0, 0)", color],
    );

    const borderColor = interpolateColors(
      progress,
      [0, 1],
      ["rgba(236, 72, 153, 0)", "rgba(236, 72, 153, 1)"],
    );
    // return <InnerLine merge={props} data-mark={true} />
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
    const color = parts[2] || "rgba(236, 72, 153, 0.2)";

    const frame = useCurrentFrame();
    const progress = interpolate(frame, [delay, delay + duration], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

    const backgroundColor = interpolateColors(
      progress,
      [0, 1],
      ["rgba(0, 0, 0, 0)", color],
    );

    const borderColor = interpolateColors(
      progress,
      [0, 1],
      ["rgba(236, 72, 153, 0)", "rgba(236, 72, 153, 1)"],
    );
    return (
      <div
        style={{
          display: "inline-block",
          backgroundColor,
          borderRadius: 4,
          padding: "0.25rem 1rem",
          margin: "0 -.125rem",
          border: `2px solid ${borderColor}`,
        }}
      >
        {children}
      </div>
    );
  },
};
