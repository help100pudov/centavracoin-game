const POSITIONS = {
  TOP_END: "top-end",
  TOP: "top",
  TOP_START: "top-start",
  BOTTOM_END: "bottom-end",
  BOTTOM: "bottom",
  BOTTOM_START: "bottom-start",
};
export default Object.freeze(POSITIONS)

export function definePosition(position, top, bottom) {
  let result = null
  switch (position) {
    case POSITIONS.TOP:
    case POSITIONS.TOP_END:
    case POSITIONS.TOP_START:
      result = top
      break

    case POSITIONS.BOTTOM:
    case POSITIONS.BOTTOM_END:
    case POSITIONS.BOTTOM_START:
      result = bottom
      break
  }
  return result
}
