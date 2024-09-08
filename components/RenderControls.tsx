import { NestedCompositionProjectType } from "~/types/timeline.types";
import { useRendering } from "../helpers/use-rendering";
import { AlignEnd } from "./AlignEnd";
import { Button } from "./Button";
import { InputContainer } from "./Container";
import { DownloadButton } from "./DownloadButton";
import { ErrorComp } from "./Error";
import { ProgressBar } from "./ProgressBar";
import { Spacing } from "./Spacing";

export const RenderControls: React.FC<{
  inputProps: NestedCompositionProjectType["props"];
}> = ({ inputProps }) => {
  const { renderMedia, state, undo } = useRendering("new-dynamic-composition", inputProps);

  return (
    <InputContainer>
      {state.status === "init" || state.status === "invoking" || state.status === "error" ? (
        <>
          <AlignEnd>
            <Button
              disabled={state.status === "invoking"}
              loading={state.status === "invoking"}
              onClick={renderMedia}
            >
              Render video
            </Button>
          </AlignEnd>
          {state.status === "error" ? <ErrorComp message={state.error.message}></ErrorComp> : null}
        </>
      ) : null}
      {state.status === "rendering" || state.status === "done" ? (
        <>
          <ProgressBar progress={state.status === "rendering" ? state.progress : 1} />
          <Spacing></Spacing>
          <AlignEnd>
            <DownloadButton undo={undo} state={state}></DownloadButton>
          </AlignEnd>
        </>
      ) : null}
    </InputContainer>
  );
};
