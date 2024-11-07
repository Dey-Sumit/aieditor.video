"use client";
import { RefreshCw } from "lucide-react";
import { useState } from "react";
import { getCaptions } from "~/app/captioning/caption-state";

import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { CAPTION_DATA } from "~/data/nested-composition.data";
import { processCaptions } from "~/utils/captions.utils";
const src =
  "https://video-editor-user-upload-assets.s3.ap-south-1.amazonaws.com/Sumit%27s%20Video%20-%20Oct%2026%2C%202024.mp4?response-content-disposition=inline&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBEaCmFwLXNvdXRoLTEiSDBGAiEAyLJ7hCth0QKAWGyDuo53gQ2sfIs3KENOrxflx7epIY0CIQDQqR%2BO%2BBhwDreiUPCWAA6T9%2BSwZPdHwY3WIOzdfX8ulyrUAwiK%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDA1ODI2NDI1MjM3MSIMN%2FtF%2FSBrPKYMzP%2FGKqgDckv8pA4O8kdB50erAMsY9A5Kw6P6%2FCX9%2FdD7IhwbzNJJov5VptmSoRfY78SS1qqdw4xT5aQhmhQnvbugnohqVd1qOh8wIZiZRmPY48raSJgejP6LbyQVquaP1UgOLv%2B44XDcGqG%2FQwW7foBW5UKB%2BL%2BRLdueELJDTg5POdd41mxeDtbhLxnniWWopYgj1WJsEFKyBICEr6F8gL11Lz6dg62k9MjJnnE%2BmedXpK315rzjTrSsxAsh1iR4BgwqlHQCuKalKAGW75cv%2BhOrJ9jpAm31lddqfJ773tfcIGYsDNltfs0h5k%2Fp2eKxu5Q5vAMJs3toQI1usg%2FTPWBS%2BpsIodc1AjS2JOJBPfmqFXxLziG8CkBVu5bjRhEYFL0txYZxFWBmpW1Jqsz6fLOqb1MxU5Puk0C9LOXg2lUFDiPd7cq40rmV%2BkQe9dYTn0NRgp5Zi9fxJFQxqhjISQK5BCenZJF0%2FJ0A%2BRZnSVSrdZynabUhrfjQ%2FltCTc3QwutMK7wpmXwXdlUYWvCfEogtbvXViDl9a2%2F0V7e%2BFh2bXFoDHEukILlK6C5rwDDOho25BjrjAvwXDZCqxX5moKzjagSZnhPSI8z%2BvCQ4bbGj0z7IYIH9oDUWXGQkjDKIpW8ffbfZdER%2B5AKKe73guQC8PvvMGXCDhLUW9dGKzJuGGL7LTL0ObcHXiKWCzhOWrKJunpZMTm0oSatGzh05rwbtP1I1GB7q01XVDrrj9xw67d1Y3T1ZP%2FQjQEOrp3C5JdnWeDCMlAkgqD4n9c4j5K9EwJ0jgPirQCV6n2uNwH4T5dc2yH%2FNMneppkpm2reCLj%2Fd2YmXmkZEsXOMs0%2Fi1h0RwJezdvz%2BvSt6vAN%2B%2F55qaS2erh6CuBto1LHsZ0M56%2BAX8F%2F1qXFrmwoW4N5avO2sRaSgAAo7XfMam1qLknZF8cr%2BfzZGstTiFrr9t24keciTX0dIu%2F1G1A7pCF9nKdfEaL5hcqNcHhecFVIoNtI%2FEfAfytk8V51xVu9uWRgGPI6ki5fgSvpeibuagjGErzHzRm2LHpB3Fx0%3D&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=ASIAQ3EGR57J5M7LVD7F%2F20241031%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20241031T084523Z&X-Amz-Expires=7200&X-Amz-SignedHeaders=host&X-Amz-Signature=1eb27f16cbd7bfe64692291f5d42378daafc509120f5e6cb931b7f1ff7d37157";

export default function Component() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedOption, setSelectedOption] = useState("entire");
  //@ts-ignore
  const handleGenerateCaptionsNew = async () => {
    console.log("Generating captions ...");

    setIsGenerating(true);

    const res = await fetch(`/api/captions`, {
      method: "POST",
      // headers: {
      //   "Content-Type": "audio/wav",
      // },
      body: src,
    });
    console.log({ res });

    // Simulating caption generation process
    // setTimeout(() => {
    //   setIsGenerating(false);
    //   toast.success("Captions generated successfully", {
    //     description: `Captions generated for ${getOptionLabel(selectedOption)}.`,
    //     position: "top-center",
    //   });
    // }, 1000);
    // const audio = await extractAudio(src);
  };

  // const getOptionLabel = (option: string) => {
  //   switch (option) {
  //     case "entire":
  //       return "Entire Timeline";
  //     case "selected-media":
  //       return "Selected Media";

  //     default:
  //       return option;
  //   }
  // };

  const handleCaption = () => {
    getCaptions({
      src: src,
      setCaptionState: (state) => {
        console.log("setCaptionState ----> ", { state });
      },
    });
  };

  const transformCaptionData = () => {
    console.log("transorming caption");
    const data = processCaptions({
      captions: CAPTION_DATA.captions,
      fps: 30,
      layerId: "layer-1",
    });
    console.log({ data });
  };

  return (
    <div>
      <div className="h-[56px] border-b">Captions</div>
      <div className="mx-auto w-full max-w-md space-y-6 p-4">
        <h2 className="text-center text-2xl font-bold">Generate Captions</h2>

        <RadioGroup
          value={selectedOption}
          onValueChange={setSelectedOption}
          className="space-y-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="selected-media" id="selected-media" />
            <Label htmlFor="selected-media">Selected Media</Label>
          </div>

          <div className="flex items-center space-x-2">
            <RadioGroupItem value="entire" id="entire" />
            <Label htmlFor="entire">Entire Timeline</Label>
          </div>
        </RadioGroup>
        <Button onClick={handleCaption}>Gen caption</Button>
        <Button
          onClick={() => {
            console.log("hello");
          }}
          disabled={isGenerating}
          className="w-full"
        >
          {isGenerating ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Generating Captions...
            </>
          ) : (
            "Generate Captions"
          )}
        </Button>
        <Button onClick={transformCaptionData}>Let's go</Button>
      </div>
    </div>
  );
}
