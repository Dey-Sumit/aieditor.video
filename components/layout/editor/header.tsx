import { FC } from "react";
import { DownloadButton } from "~/components/DownloadButton";
import { ProgressBar } from "~/components/ProgressBar";
import { Button } from "~/components/ui/button";
import { useRendering } from "~/helpers/use-rendering";
import useVideoStore from "~/store/video.store";

export const Header: FC = () => {
  const { props } = useVideoStore();
  const { renderMedia, state, undo } = useRendering("new-dynamic-composition", props);
  return (
    <header className="sticky top-0 z-10 h-[57px] border-b bg-background">
      <div className="flex h-full items-center justify-between p-3">
        <div>Please finish this</div>

        <div className="flex flex-1 items-center justify-end gap-1.5">
          {state.status === "rendering" || state.status === "done" ? (
            <div className="flex w-full items-center gap-1.5">
              <ProgressBar progress={state.status === "rendering" ? state.progress : 1} />

              <DownloadButton undo={undo} state={state}></DownloadButton>
            </div>
          ) : null}
          <Button
            size="sm"
            variant="outline"
            disabled={state.status === "invoking"}
            onClick={renderMedia}
          >
            {state.status === "invoking" ? "Cooking..." : "Export Video"}
            {/* <ImportIcon className="size-3.5" />
          Export */}
          </Button>
        </div>
      </div>
    </header>
  );
};
