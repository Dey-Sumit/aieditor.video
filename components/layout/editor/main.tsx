import { FC } from "react";
import { Badge } from "~/components/ui/badge";
import { Label } from "~/components/ui/label";
import {
  TooltipTrigger,
  Tooltip,
  TooltipProvider,
} from "~/components/ui/tooltip";
import { Button } from "~/components/ui/button";
import { UploadIcon } from "~/components/Icons";

export const Main: FC = () => (
  <main className="grid flex-1 gap-4 overflow-auto p-4 md:grid-cols-2 lg:grid-cols-3">
    <div
      className="relative flex flex-col items-start gap-8"
      x-chunk="dashboard-03-chunk-0"
    >
      <form className="grid w-full items-start gap-6">
        <fieldset className="grid gap-6 rounded-lg border p-4">
          <legend className="-ml-1 px-1 text-sm font-medium">Media</legend>
          <div className="grid gap-3">
            <Label htmlFor="upload">Upload File</Label>
            <div className="h-32 rounded-lg border-2 border-dashed border-gray-300 bg-gray-100 p-4 dark:border-gray-700 dark:bg-gray-800">
              <div className="flex h-full flex-col items-center justify-center space-y-2">
                <UploadIcon className="size-6" />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Drag and drop files or click to upload
                </p>
              </div>
            </div>
          </div>
        </fieldset>
      </form>
    </div>
    <div className="relative flex h-full min-h-[50vh] flex-col rounded-xl bg-muted/50 p-4 lg:col-span-2">
      <Badge className="absolute right-3 top-3" variant="outline">
        Video Preview
      </Badge>
      <div className="flex-1">
        <span className="h-full w-full rounded-md bg-muted object-cover" />
      </div>
      <form
        className="relative overflow-hidden rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring"
        x-chunk="dashboard-03-chunk-1"
      >
        <Label className="sr-only" htmlFor="timeline">
          Timeline
        </Label>
        <div className="flex items-center p-3 pt-0">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="icon" variant="ghost" />
              </TooltipTrigger>
            </Tooltip>
          </TooltipProvider>
        </div>
      </form>
    </div>
  </main>
);
