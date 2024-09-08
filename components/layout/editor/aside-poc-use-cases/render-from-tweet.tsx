"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "~/components/ui/card";
import { Twitter } from "lucide-react";
import { useState } from "react";
import { TooltipButton } from "~/components/ui/custom/tool-tip-button";
// import { useVideoStore } from "~/zustand/video-store";
// import { z } from "zod";

// const validateXLinkUsingZod = (link: string) => {
//   const zodSchema = z.object({
//     link: z.string().url(),
//   });
//   return zodSchema.safeParse(link).success;
// };

const RenderFromTweet: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [tweetLink, setTweetLink] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("");
  console.log("selectedStyle", selectedStyle);

  // const loadProject = useVideoStore((state) => state.loadProject);

  const createTheFlow = () => {
    setIsOpen(true);
    setStep(1);
    setTweetLink("");
    setSelectedStyle("");
  };

  const closeModal = () => {
    setIsOpen(false);
    setStep(1);
  };

  const handleChooseStyle = async () => {
    // Mock API call to get tweet details
    //   await new Promise((resolve) => setTimeout(resolve, 1000));
    setStep(2);
  };

  const handleStyleSelection = async (style: string) => {
    setSelectedStyle(style);
    await updateProjectForTweet();
    closeModal();
  };

  const updateProjectForTweet = async () => {
    console.log("Updating project for tweet");
    // const project = await prepareProject(
    //   DUMMY_ASSETS.SAMPLES.VIDEOS.REMOTE_TWITTER_VIDEO,
    // );
    // loadProject();
  };

  // const prepareProject = async (
  //   videoSrc: string,
  // ): Promise<NestedCompositionProjectType> => {
  //   // Mocking video metadata for this example
  //   const durationInSeconds = 40.5;
  //   const roundedDuration = Math.round(durationInSeconds);

  //   return {};
  // };

  return (
    <>
      <TooltipButton
        icon={<Twitter className="size-5" />}
        toolTipContent="Render from Tweet"
        buttonProps={{
          size: "icon",
          variant: "ghost",
          className: "rounded-lg",
          onClick: createTheFlow,
        }}
      />

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {step === 1 ? "Enter Tweet Link" : "Choose Style"}
            </DialogTitle>
            <DialogDescription>
              {step === 1
                ? "Paste the link to the tweet you want to render."
                : "Select a style for your video."}
            </DialogDescription>
          </DialogHeader>

          {step === 1 && (
            <>
              <div className="grid gap-4 py-4">
                <Input
                  id="tweetLink"
                  value={tweetLink}
                  onChange={(e) => setTweetLink(e.target.value)}
                  placeholder="https://x.com/..."
                />
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={closeModal}>
                  Cancel
                </Button>
                <Button
                  onClick={handleChooseStyle}
                  //     disabled={!validateXLinkUsingZod(tweetLink)}
                >
                  Choose Style
                </Button>
              </DialogFooter>
            </>
          )}

          {step === 2 && (
            <div className="grid gap-4 py-4">
              <Card
                className="cursor-pointer hover:bg-gray-100"
                onClick={() => handleStyleSelection("style1")}
              >
                <CardHeader>
                  <CardTitle>Style 1</CardTitle>
                  <CardDescription>Description of Style 1</CardDescription>
                </CardHeader>
              </Card>
              <Card
                className="cursor-pointer hover:bg-gray-100"
                onClick={() => handleStyleSelection("style2")}
              >
                <CardHeader>
                  <CardTitle>Style 2</CardTitle>
                  <CardDescription>Description of Style 2</CardDescription>
                </CardHeader>
              </Card>
              <Card
                className="cursor-pointer hover:bg-gray-100"
                onClick={() => handleStyleSelection("blank")}
              >
                <CardHeader>
                  <CardTitle>Blank</CardTitle>
                  <CardDescription>Start with a blank template</CardDescription>
                </CardHeader>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default RenderFromTweet;
