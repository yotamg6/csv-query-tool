export const calcTooltipMaxWidth = (wordLimit: number, avgCharsPerWord = 6): string => {
  // “ch” is width of “0” glyph; avgCharsPerWord*wordLimit ch ≈ space for that many letters
  return `${wordLimit * avgCharsPerWord}ch`;
};
