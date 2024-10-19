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

// const applyAnimation = ({ animations, frame, fps }: ApplyAnimationsProps) => {

//   if (!animations) return {}; // No animation specified

//   switch (animation.type) {
//     case "scale": {
//       const scale = spring({
//         frame,
//         fps,
//         from: animation.from,
//         to: animation.to,
//         config: { damping: animation.damping || 10 },
//         durationInFrames: animation.duration || 30,
//       });
//       return { transform: `scale(${scale})` };
//     }

//     case "fade-in": {
//       const opacity = interpolate(
//         frame,
//         [0, animation.duration || 60],
//         [0, 1],
//         { extrapolateRight: "clamp" },
//       );
//       return { opacity };
//     }

//     default:
//       return {};
//   }
// };

export const applyAnimations = ({
  animations,
  frame,
  fps,
}: ApplyAnimationsProps): { transform: string; opacity?: number } => {
  let transform = "";
  let opacity = 1; // Default opacity

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

    if (animation.type === "fade-in") {
      opacity = spring({
        frame,
        fps,
        from: animation.from,
        to: animation.to,
        durationInFrames: animation.duration,
      });
    }
    if (animation.type === "translateX") {
      const translateX = spring({
        frame,
        fps,
        from: animation.from,
        to: animation.to,
        durationInFrames: animation.duration,
      });
      transform += `translateX(${translateX}px) `;
    }
  });

  return {
    transform: transform.trim(),
    opacity, // Add opacity if a fade-in animation is present
  };
};

/* export const applyAnimations = ({
  animations,
  frame,
  fps,
}: ApplyAnimationsProps) => {
  if (!animations || animations.length === 0) return {}; // No animations

  let opacity = 1;
  let transform = "";
  let filter = "";

  // Loop through all animations and apply them
  animations.forEach((animation) => {
    switch (animation.type) {
      case "fade-in": {
        const fadeOpacity = interpolate(
          frame,
          [0, animation.duration || 60],
          [0, 1],
          { extrapolateRight: "clamp" },
        );
        opacity *= fadeOpacity;
        break;
      }
      case "translateX": {
        const translateX = interpolate(
          frame,
          [0, animation.duration || 30],
          [animation.from || -100, animation.to || 0],
          { extrapolateRight: "clamp" },
        );
        transform += `translateX(${translateX}px) `;
        break;
      }
      case "scale": {
        const scale = spring({
          frame,
          fps,
          from: animation.from || 0.9,
          to: animation.to || 1,
          config: { damping: animation.damping || 10 },
          durationInFrames: animation.duration || 30,
        });
        transform += `scale(${scale}) `;
        break;
      }
      case "blur": {
        const blurValue = interpolate(
          frame,
          [0, animation.duration || 30],
          [animation.from || 0, animation.to || 10],
          { extrapolateRight: "clamp" },
        );
        filter += `blur(${blurValue}px) `;
        break;
      }
      // Add more animation types as needed
      default:
        break;
    }
  });

  // Return the combined styles
  return {
    opacity,
    transform: transform.trim(),
    filter: filter.trim(), // Combine all filter effects (e.g., blur)
  };
}; */

export const _applyAnimations = ({
  animations,
  frame,
  fps,
}: ApplyAnimationsProps): { transform: string; opacity?: number } => {
  let transform = "";
  let opacity = 1;
  let accumulatedFrames = 0; // Track when the next animation should start

  animations.forEach((animation, index) => {
    // Default: animation starts at the beginning unless otherwise specified
    let startFrame = accumulatedFrames;

    if (typeof animation.startAfter === "number") {
      // If it's a frame number, start after those frames
      startFrame = animation.startAfter;
    } else if (typeof animation.startAfter === "string") {
      // If it's an animation type, find when that animation ends
      const prevAnimation = animations.find(
        (a) => a.type === animation.startAfter,
      );
      if (prevAnimation) {
        startFrame = accumulatedFrames + prevAnimation.duration;
      }
    }

    // Apply animations when their start time has been reached
    if (frame >= startFrame && frame <= startFrame + animation.duration) {
      const localFrame = frame - startFrame; // Adjust frame to 0 for each animation's start

      if (animation.type === "scale") {
        const scale = spring({
          frame: localFrame,
          fps,
          from: animation.from,
          to: animation.to,
          durationInFrames: animation.duration,
        });
        transform += `scale(${scale}) `;
      }

      if (animation.type === "fade-in") {
        opacity = spring({
          frame: localFrame,
          fps,
          from: animation.from,
          to: animation.to,
          durationInFrames: animation.duration,
        });
      }
    }

    // Accumulate frames for future animations that might start after this one
    accumulatedFrames += animation.duration;
  });

  return {
    transform: transform.trim(),
    opacity,
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
