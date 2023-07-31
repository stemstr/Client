import { useEffect, useRef, useState } from "react";

interface ReferrerInfo {
  referrer: string | null;
  isFromSameOrigin: boolean;
}

const useReferrer = (): ReferrerInfo => {
  const referrer = useRef<string | null>(null);
  const [isFromSameOrigin, setIsFromSameOrigin] = useState<boolean>(false);

  useEffect(() => {
    // Get the referrer URL when the component mounts
    referrer.current = document.referrer;

    console.log("1: " + document.referrer);
    // Check if the referrer is from the same origin (within the app)
    if (referrer.current) {
      try {
        const referrerUrl = new URL(referrer.current);
        console.log("2: " + referrerUrl.origin, window.location.origin);
        setIsFromSameOrigin(referrerUrl.origin === window.location.origin);
      } catch (e) {
        // If the referrer URL is not a valid URL, it's not from the same origin
        setIsFromSameOrigin(false);
      }
    } else {
      console.log("3:");
      setIsFromSameOrigin(false);
    }
  }, []);

  return {
    referrer: referrer.current,
    isFromSameOrigin: isFromSameOrigin,
  };
};

export default useReferrer;
