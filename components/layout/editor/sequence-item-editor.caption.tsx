"use client";

import { MergeIcon, MoreVertical, Trash } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Input } from "~/components/ui/input";

interface SubtitleEntry {
  id: string;
  startTime: string;
  endTime: string;
  text: string;
}

export default function SequenceItemEditorCaption() {
  const [subtitles, setSubtitles] = useState<SubtitleEntry[]>([
    {
      id: "1",
      startTime: "00:00:00",
      endTime: "00:00:02",
      text: "I was attacked.",
    },
    {
      id: "2",
      startTime: "00:00:02",
      endTime: "00:00:04",
      text: "And when they",
    },
    {
      id: "3",
      startTime: "00:00:04",
      endTime: "00:00:06",
      text: "pulled the hood",
    },
    { id: "4", startTime: "00:00:06", endTime: "00:00:08", text: "off, I was" },
    {
      id: "5",
      startTime: "00:00:08",
      endTime: "00:00:10",
      text: "kneeling in",
    },
    {
      id: "1",
      startTime: "00:00:00",
      endTime: "00:00:02",
      text: "I was attacked.",
    },
    {
      id: "2",
      startTime: "00:00:02",
      endTime: "00:00:04",
      text: "And when they",
    },
    {
      id: "3",
      startTime: "00:00:04",
      endTime: "00:00:06",
      text: "pulled the hood",
    },
    { id: "4", startTime: "00:00:06", endTime: "00:00:08", text: "off, I was" },
    {
      id: "5",
      startTime: "00:00:08",
      endTime: "00:00:10",
      text: "kneeling in",
    },
  ]);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, subtitles.length);
  }, [subtitles]);

  const [activeId, setActiveId] = useState<string | null>(null);

  const handleFocus = (id: string) => {
    setActiveId(id);
  };

  const handleBlur = () => {
    setActiveId(null);
  };

  const handleDelete = (id: string) => {
    setSubtitles(subtitles.filter((subtitle) => subtitle.id !== id));
  };

  const handleMerge = (id: string) => {
    const currentIndex = subtitles.findIndex((subtitle) => subtitle.id === id);
    if (currentIndex < subtitles.length - 1) {
      const newSubtitles = [...subtitles];
      newSubtitles[currentIndex] = {
        ...newSubtitles[currentIndex],
        endTime: newSubtitles[currentIndex + 1].endTime,
        text: `${newSubtitles[currentIndex].text} ${newSubtitles[currentIndex + 1].text}`,
      };
      newSubtitles.splice(currentIndex + 1, 1);
      setSubtitles(newSubtitles);
    }
  };

  const handleTextChange = (id: string, newText: string) => {
    setSubtitles(
      subtitles.map((subtitle) =>
        subtitle.id === id ? { ...subtitle, text: newText } : subtitle,
      ),
    );
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const nextInput = inputRefs.current[index + 1];
      if (nextInput) {
        nextInput.focus();
      }
    }
  };

  const handleSave = () => {};

  return (
    <>
      <div className="sticky inset-x-0 top-0 flex h-12 items-center justify-end gap-2 p-2">
        <Button variant="outline" size="sm">
          Cancel
        </Button>
        <Button size="sm" variant="secondary" onClick={handleSave}>
          Save
        </Button>
      </div>

      <div className="max-h-[500px] space-y-2 overflow-y-auto pt-4">
        {subtitles.map((subtitle, index) => (
          <div
            key={subtitle.id}
            onFocus={() => handleFocus(subtitle.id)}
            onBlur={handleBlur}
            className={`group relative flex items-start justify-between space-x-4 border-l-2 py-2 transition-colors duration-200 ${
              activeId === subtitle.id
                ? "border-orange-700"
                : "border-transparent hover:border-muted-foreground"
            }`}
            onClick={() => inputRefs.current[index]?.focus()}
          >
            <div className="flex-1 space-y-1 pl-4">
              <div className="flex space-x-1 text-xs text-muted-foreground">
                <span>{subtitle.startTime}</span>
                <span>→</span>
                <span>{subtitle.endTime}</span>
              </div>
              <Input
                ref={(el) => (inputRefs.current[index] = el)}
                value={subtitle.text}
                onChange={(e) => handleTextChange(subtitle.id, e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onFocus={() => handleFocus(subtitle.id)}
                onBlur={handleBlur}
                className="h-auto bg-background p-2 text-base shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleMerge(subtitle.id)}>
                  <MergeIcon className="mr-2 h-4 w-4" />
                  Merge with next
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleDelete(subtitle.id)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ))}
      </div>
    </>
  );
}
