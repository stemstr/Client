import { useEffect, useRef } from "react";

interface ReferrerInfo {
  referrer: string | null;
  isFromSameOrigin: boolean;
}

const useReferrer = (): ReferrerInfo => {
  const referrer = useRef<string | null>(null);
  const isFromSameOrigin = useRef<boolean>(false);

  useEffect(() => {
    // Get the referrer URL when the component mounts
    referrer.current = document.referrer;

    // Check if the referrer is from the same origin (within the app)
    if (referrer.current) {
      try {
        const referrerUrl = new URL(referrer.current);
        isFromSameOrigin.current =
          referrerUrl.origin === window.location.origin;
      } catch (e) {
        // If the referrer URL is not a valid URL, it's not from the same origin
        isFromSameOrigin.current = false;
      }
    } else {
      isFromSameOrigin.current = false;
    }
  }, []);

  return {
    referrer: referrer.current,
    isFromSameOrigin: isFromSameOrigin.current,
  };
};

export default useReferrer;
