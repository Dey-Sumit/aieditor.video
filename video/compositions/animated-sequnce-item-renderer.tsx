import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { ImageSequenceItemType } from "~/types/timeline.types";

export const AnimatedImageScale = ({
  item,
}: {
  item: ImageSequenceItemType;
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Spring animation for scaling the image from 90% to 100%
  const scale = spring({
    frame,
    fps,
    from: 0.9, // Starting scale (90%)
    to: 1, // Ending scale (100%)
    config: {
      damping: 10,
    },
    durationInFrames: 30, // Duration of the scaling effect over 30 frames
  });

  return (
    <AbsoluteFill className="">
      <AbsoluteFill className="" style={item.editableProps?.styles?.overlay} />
      <Img
        src={item.editableProps.imageUrl}
        style={{
          objectFit: "cover",
          transform: `scale(${scale})`, // Apply the scaling effect
          ...item.editableProps?.styles?.element,
        }}
        className="box-content"
      />
    </AbsoluteFill>
  );
};

export const AnimatedImageFadeIn = ({
  item,
}: {
  item: ImageSequenceItemType;
}) => {
  const frame = useCurrentFrame();

  const opacity = interpolate(frame, [0, 60], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill className="" style={{ opacity: opacity }}>
      <AbsoluteFill className="" style={item.editableProps?.styles?.overlay} />
      <Img
        src={item.editableProps.imageUrl}
        style={{
          objectFit: "cover",
          ...item.editableProps?.styles?.element,
        }}
        className="box-content"
      />
    </AbsoluteFill>
  );
};

// Define the type for a single animation object
type AnimationType = {
  type: string; // Currently only supporting scale, but you can extend this
  from: number; // Starting value (e.g., scale from 0.9)
  to: number; // Ending value (e.g., scale to 1)
  duration: number; // Duration in frames for the animation
};

// Define the type for the function parameters
interface ApplyAnimationsProps {
  animations: AnimationType[]; // Array of animations (currently just scale)
  frame: number; // Current frame (from Remotion's useCurrentFrame)
  fps: number; // Frames per second (from useVideoConfig)
}

// The applyAnimations function with types
export const applyAnimations = ({
  animations,
  frame,
  fps,
}: ApplyAnimationsProps): { transform: string } => {
  let transform = "";

  animations.forEach((animation) => {
    if (animation.type === "scale") {
      const scale = spring({
        frame,
        fps,
        from: animation.from,
        to: animation.to,
        durationInFrames: animation.duration,
      });
      transform += `scale(${scale}) `;
    }
  });

  return {
    transform: transform.trim(), // Return the final transform string
  };
};

export const AnimatedImage = ({ item }: { item: ImageSequenceItemType }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Safely apply animations with type checking
  const animationStyles = applyAnimations({
    animations: item.animations ?? [],
    frame,
    fps,
  });

  return (
    <AbsoluteFill>
      <Img
        src={item.editableProps.imageUrl}
        style={{
          objectFit: "cover",
          ...animationStyles, // Apply the transform (scale) animation
          ...item.editableProps?.styles?.element,
        }}
      />
    </AbsoluteFill>
  );
};
