import {
  AbsoluteFill,
  Img,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { ImageSequenceItemType } from "~/types/timeline.types";

type AnimationType = {
  type: string; // Currently only supporting scale, but you can extend this
  from: number; // Starting value (e.g., scale from 0.9)
  to: number; // Ending value (e.g., scale to 1)
  duration: number; // Duration in frames for the animation
};

interface ApplyAnimationsProps {
  // Define the type for the function parameters
  animations: AnimationType[]; // Array of animations (currently just scale)
  frame: number; // Current frame (from Remotion's useCurrentFrame)
  fps: number; // Frames per second (from useVideoConfig)
}
export const testSequenceItems: Record<string, ImageSequenceItemType> = {
  "s-image-c12ff9f0-21f0-44bd-83dd-c2e1d7931a93": {
    id: "s-image-c12ff9f0-21f0-44bd-83dd-c2e1d7931a93",
    layerId: "l-c8319623-268e-41be-a608-5f32142c90b1",
    type: "image",
    editableProps: {
      styles: {
        container: {},
        element: {
          "object-fit": "contain",
          width: "100%",
          height: "100%",
        },
        overlay: {},
      },
      imageUrl:
        "https://images.pexels.com/photos/28689135/pexels-photo-28689135.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
    },
    animations: [
      {
        type: "scale",
        from: 0.7,
        to: 1,
        duration: 30, // Scale over 30 frames
        // startAfter: 0, // Starts immediately
      },
      {
        type: "fade-in",
        from: 0,
        to: 1,
        duration: 60,
        //  startAfter: "scale", // Start after the 'scale' animation completes
      },
      {
        type: "rotate",
        from: 30,
        to: 0,
        duration: 60,
        //   triggerAtProgress: { animationType: "fade-in", progress: 0.5 }, // Start when 'fade-in' reaches 50%
      },
    ],
  },
};

export const AnimatedImageComposition = ({
  item,
}: {
  item: ImageSequenceItemType;
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Safely apply animations with type checking
  const animationStyles = applyAnimations({
    animations: item.animations ?? [],
    frame,
    fps,
  });

  return (
    <AbsoluteFill className="bg-gray-950">
      <Img
        src={item.editableProps.imageUrl}
        style={{
          objectFit: "cover",
          ...animationStyles, // Apply both transform (scale) and opacity (fade-in)
          ...item.editableProps?.styles?.element,
        }}
      />
    </AbsoluteFill>
  );
};

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
    if (animation.type === "rotate") {
      const rotate = spring({
        frame,
        fps,
        from: animation.from,
        to: animation.to,
        durationInFrames: animation.duration,
      });
      transform += `rotate(${rotate}deg) `;
    }
  });

  return {
    transform: transform.trim(),
    opacity, // Add opacity if a fade-in animation is present
  };
};
