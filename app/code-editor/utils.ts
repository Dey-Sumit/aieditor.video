interface MarkOptions {
  startLine: number;
  endLine: number;
  startColumn: number;
  endColumn: number;
  multiRanges?: Array<{
    startColumn: number;
    endColumn: number;
  }>;
}

export const generateCodeHikeMark = ({
  startLine,
  endLine,
  startColumn,
  endColumn,
  multiRanges,
}: MarkOptions): string => {
  console.log("generateCodeHikeMark", {
    startLine,
    endLine,
    startColumn,
    endColumn,
    multiRanges,
  });

  // Case 1: Multiple selections on same line
  if (multiRanges && multiRanges.length > 1) {
    console.log({ multiRanges });

    const markers = multiRanges
      .map((range) => `[${range.startColumn}:${range.endColumn - 1}]`)
      .join(" ");
    return `// !mark${markers}\n`;
  }

  // Case 2: Single selection (word or part of line)
  if (startLine === endLine) {
    const _endColumn = endColumn - 1;
    return `// !mark[${startColumn}:${_endColumn}]\n`;
  }

  // Case 3: Multi-line selection
  const lineCount = endLine - startLine;
  return `// !mark(1:${lineCount})\n`;
};
