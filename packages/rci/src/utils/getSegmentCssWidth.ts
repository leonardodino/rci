/** paddingX must be a valid [CSS length](https://developer.mozilla.org/en-US/docs/Web/CSS/length). */
export const getSegmentCssWidth = (paddingX: string) => {
  return `calc(1ch + ${paddingX} * 2)`
}
