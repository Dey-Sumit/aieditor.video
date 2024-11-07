import { continueRender, delayRender, staticFile } from "remotion";

export const TheBoldFont = `TheBoldFont`;

let loaded = false;

export const loadFont = async (): Promise<void> => {
  console.log("Loading font");

  if (loaded) {
    return Promise.resolve();
  }

  if (typeof FontFace === "undefined") {
    return;
  }

  const waitForFont = delayRender();

  loaded = true;

  const font = new FontFace(
    TheBoldFont,
    `url('${staticFile("theboldfont.ttf")}') format('truetype')`,
  );
  console.log({ font });

  await font.load();
  document.fonts.add(font);

  continueRender(waitForFont);
};
