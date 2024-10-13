import AnimatedGradientText from "~/components/magicui/animated-gradient-text";
import { BorderBeam } from "~/components/magicui/border-beam";
import Particles from "~/components/magicui/particles";
import { cn } from "~/lib/utils";
import { ChevronRight } from "lucide-react";
import HeroVideoDialog from "~/components/magicui/hero-video-dialog";
import Link from "next/link";

export default function Hero() {
  return (
    <div className="relative w-full pt-20 text-white md:pt-24">
      <div className="fixed inset-x-0 top-20 h-[20vh] md:h-[60vh]">
        <Particles
          className="h-full w-full"
          quantity={100}
          color="#ffffff"
          ease={100}
          refresh
        />
      </div>
      <div className="container mx-auto flex min-h-screen flex-col items-center justify-start px-2 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-y-4 text-center sm:gap-y-8">
          <div className="flex flex-col gap-y-3">
            <h1 className="text-4xl font-bold md:text-5xl lg:text-6xl xl:text-7xl">
              Make Videos in Seconds
            </h1>

            <p className="mx-auto max-w-xl text-sm font-light text-gray-300 sm:max-w-2xl md:text-xl">
              Transform your ideas into professional videos effortlessly. Let AI
              do the heavy lifting while you focus on your story.
            </p>
          </div>

          <Link href="editor/crazy-video-id/media">
            <div className="relative z-10 w-full sm:w-auto">
              <AnimatedGradientText className="flex items-center justify-center rounded-full bg-white px-4 py-2 sm:py-3">
                🧑‍🍳 <hr className="mx-2 h-4 w-[1px] shrink-0 bg-gray-300" />{" "}
                <span
                  className={cn(
                    `inline animate-gradient bg-gradient-to-r from-[#ffaa40] via-[#9c40ff] to-[#ffaa40] bg-[length:var(--bg-size)_100%] bg-clip-text text-sm text-transparent sm:text-lg`,
                  )}
                >
                  Cooking for beta release
                </span>
                <ChevronRight className="ml-1 size-5 text-[#ffaa40] transition-transform duration-300 ease-in-out group-hover:translate-x-0.5 sm:size-6" />
              </AnimatedGradientText>
            </div>
          </Link>
        </div>

        {/* --------------- hero media section --------------- */}
        <div
          className={cn(
            "relative my-8 flex h-[180px] flex-col items-center justify-center rounded-xl backdrop-blur-lg sm:my-12 sm:h-[350px] md:my-16 md:h-[450px] lg:h-[550px] xl:h-[650px]",
            "before:absolute before:left-0 before:top-0 before:z-[-1] before:h-full before:w-full before:[background-image:linear-gradient(to_bottom,red,blue)] before:[filter:blur(160px)] md:before:[background-image:linear-gradient(to_bottom,red,blue,transparent_40%)]",
            // "before:animate-gradient-fade-in before:opacity-0",
          )}
        >
          {/* <div className="h-full w-[300px] md:w-[900px]"></div> */}
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
