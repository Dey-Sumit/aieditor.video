import AnimatedGradientText from "~/components/magicui/animated-gradient-text";
import { BorderBeam } from "~/components/magicui/border-beam";
import Particles from "~/components/magicui/particles";
import { cn } from "~/lib/utils";
import { ChevronRight } from "lucide-react";
import HeroVideoDialog from "~/components/magicui/hero-video-dialog";

export default function Hero() {
  return (
    <div className="relative w-full bg-black pt-24 text-white">
      <div className="fixed inset-x-0 top-20 h-[20vh] md:h-[60vh]">
        <Particles className="h-full w-full" quantity={100} color="#ffffff" ease={100} refresh />
      </div>
      <div className="container mx-auto flex min-h-screen flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-y-4 text-center sm:gap-y-8">
          <h1 className="text-2xl font-bold sm:text-3xl md:text-5xl lg:text-6xl xl:text-7xl">
            Make Videos in Seconds.
          </h1>

          <p className="mx-auto max-w-xl text-base text-gray-300 sm:max-w-2xl sm:text-lg md:text-xl">
            Transform your ideas into professional videos effortlessly. Let AI do the heavy lifting
            while you focus on your story.
          </p>

          <div className="">
            <button className="relative z-10 w-full sm:w-auto">
              <AnimatedGradientText className="flex items-center justify-center rounded-full bg-white px-4 py-2 sm:py-3">
                🧑‍🍳 <hr className="mx-2 h-4 w-[1px] shrink-0 bg-gray-300" />{" "}
                <span
                  className={cn(
                    `inline animate-gradient bg-gradient-to-r from-[#ffaa40] via-[#9c40ff] to-[#ffaa40] bg-[length:var(--bg-size)_100%] bg-clip-text text-base text-transparent sm:text-lg`
                  )}
                >
                  Cooking for beta release
                </span>
                <ChevronRight className="ml-1 size-5 text-[#ffaa40] transition-transform duration-300 ease-in-out group-hover:translate-x-0.5 sm:size-6" />
              </AnimatedGradientText>
            </button>
          </div>
        </div>

        <div
          className={cn(
            "relative my-4 flex w-full flex-col  items-center justify-center border border-gray-950 rounded-xl backdrop-blur-lg sm:my-12 sm:h-[300px] md:my-16 md:h-[400px] lg:h-[500px] xl:h-[700px]",
            "before:absolute before:left-0 before:top-0 before:z-[-1] before:h-full before:w-full before:[background-image:linear-gradient(to_bottom,red,blue,transparent_40%)] before:[filter:blur(160px)]"
          )}
        >
          <HeroVideoDialog
            // className="block dark:hidden"
            animationStyle="from-center"
            videoSrc="https://www.youtube.com/embed/cu6fUq2lOyo"
            thumbnailSrc="/hero-image.png"
            thumbnailAlt="Hero Video"
          />

          <BorderBeam size={300} duration={12} delay={9} />
        </div>
      </div>
    </div>
  );
}
