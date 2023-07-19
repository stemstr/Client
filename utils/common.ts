export const noop = () => {};

export const chunkArray = (array: any[], chunkSize: number) => {
  const chunkedArray = [];
  const length = array.length;

  for (let i = 0; i < length; i += chunkSize) {
    const chunk = array.slice(i, i + chunkSize);
    chunkedArray.push(chunk);
  }

  return chunkedArray;
};

export function constrain(value: number, min: number, max: number) {
  if (value < min) {
    return min;
  } else if (value > max) {
    return max;
  }
  return value;
}

export const isPwa = () => {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    // @ts-expect-error - standalone exists on navigator on iOS
    window.navigator.standalone === true
  );
};
