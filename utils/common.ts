import { isIOS } from "react-device-detect";

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

export function hasNotch() {
  const screenWidth = window.screen.width;
  const screenHeight = window.screen.height;
  const viewportSizes = [
    { width: 360, height: 780 }, // iPhone 12 mini, 13 mini
    { width: 375, height: 812 }, // iPhone X, XS, 11 Pro
    { width: 390, height: 844 }, // iPhone 12, 13 mini, 14
    { width: 393, height: 852 }, // iPhone 14 Pro
    { width: 414, height: 896 }, // iPhone XS Max, XR, 11 Pro Max, 11
    { width: 428, height: 926 }, // iPhone 12 Pro Max, 13 Pro Max, 14 Plus
    { width: 430, height: 932 }, // iPhone 14 Pro Max
  ];

  return (
    viewportSizes.some(
      (aspectRatio) =>
        screenWidth === aspectRatio.width && screenHeight === aspectRatio.height
    ) && isIOS
  );
}
