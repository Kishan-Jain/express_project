export const IsSpaceUsed = (text) => {
  return text.split("").filter(char => char === " ") > 0
}
