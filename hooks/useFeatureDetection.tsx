import { useEffect, useState } from "react";
import { isDesktop, isChrome } from "react-device-detect";

export enum FeatureName {
  DragToDownload = 0,
}

const useFeatureDetection = (feature: FeatureName): boolean => {
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    switch (feature) {
      case FeatureName.DragToDownload:
        setIsSupported(isDesktop && isChrome);
        break;
    }
  }, []);

  return isSupported;
};

export default useFeatureDetection;
