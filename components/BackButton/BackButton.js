import { Center } from "@mantine/core";
import { useRouter } from "next/router";
import { Route } from "../../enums/routes";
import useReferrer from "../../hooks/useReferrer";

const BackButton = ({ defaultUrl, url, children }) => {
  const router = useRouter();
  const { isFromSameOrigin } = useReferrer();

  if (!defaultUrl && !url && !isFromSameOrigin) return null;

  const handleBackClick = () => {
    if (url) {
      return router.push(url);
    }
    if (isFromSameOrigin && router.pathname !== Route.Login) {
      // Navigate backward in the browser history
      return router.back();
    } else {
      // Navigate to the defaultUrl
      router.push(defaultUrl);
    }
  };

  return (
    <Center onClick={handleBackClick} sx={{ cursor: "pointer" }}>
      {children}
    </Center>
  );
};

export default BackButton;
