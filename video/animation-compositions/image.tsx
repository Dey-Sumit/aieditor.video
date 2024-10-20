import {
  AbsoluteFill,
  Img,
  interpolate,
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
  startAt: number; // Start the animation at a specific frame
};

interface ApplyAnimationsProps {
  // Define the type for the function parameters
  animations: AnimationType[]; // Array of animations (currently just scale)
  frame: number; // Current frame (from Remotion's useCurrentFrame)
  fps: number; // Frames per second (from useVideoConfig)
}

export const testSequenceItems: Record<
  string,
  ImageSequenceItemType & {
    animations: AnimationType[];
  }
> = {
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
        type: "fade-in",
        from: 0,
        to: 1,
        duration: 300,
        startAt: 0, // Starts at frame 40
      },
      {
        type: "scale",
        from: 1,
        to: 0.7,
        duration: 240,
        startAt: 120, // Starts immediately at frame 0
      },
      // {
      //   type: "rotate",
      //   from: 30,
      //   to: 0,
      //   duration: 60,
      //   startAt: 100, // Start rotating at frame 100
      // },
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
    <AbsoluteFill className="">
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

// import { interpolate, spring } from "remotion";

export const applyAnimations = ({
  animations,
  frame,
  fps,
}: ApplyAnimationsProps): { transform: string; opacity?: number } => {
  let transform = "";
  let opacity = 1; // Default opacity

  animations.forEach((animation) => {
    // Check if the current frame is after the `startAt` frame
    const localFrame = frame - (animation.startAt ?? 0); // Default `startAt` to 0

    if (localFrame < 0) {
      // If the animation hasn't started yet, skip this animation
      return;
    }

    // Apply each animation type
    if (animation.type === "scale") {
      const scale = spring({
        frame: localFrame, // Frame starts when `startAt` is reached
        fps,
        from: animation.from,
        to: animation.to,
        durationInFrames: animation.duration,
      });
      transform += `scale(${scale}) `;
    }

    if (animation.type === "fade-in") {
      opacity = interpolate(
        localFrame, // Frame starts when `startAt` is reached
        [0, animation.duration], // Map frame range from 0 to animation duration
        [animation.from, animation.to], // Opacity changes from `from` to `to`
        {
          extrapolateRight: "clamp", // Ensure the value stops at the end
        },
      );
    }

    if (animation.type === "rotate") {
      const rotate = spring({
        frame: localFrame,
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
    opacity, // Return final opacity
  };
};
