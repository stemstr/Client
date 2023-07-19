import { Center, MediaQuery } from "@mantine/core";
import BottomNavigationItem from "components/BottomNavigationItem/BottomNavigationItem";
import useAuth from "hooks/useAuth";
import { PlusIcon } from "icons/StemstrIcon";
import { useDispatch } from "react-redux";
import { openSheet } from "store/Sheets";

export default function BottomNavigationMiddleItem() {
  const dispatch = useDispatch();
  const { guardAuth } = useAuth();

  const handleClick = () => {
    if (!guardAuth()) return;
    dispatch(openSheet({ sheetKey: "postSheet" }));
  };

  return (
    <BottomNavigationItem middleButton>
      <Center
        onClick={handleClick}
        sx={{
          width: "100%",
          height: "100%",
          borderRadius: "50%",
          background:
            "linear-gradient(142.52deg, #856BA3 9.14%, rgba(129, 36, 238, 0.76) 90.68%)",
          color: "white",
          cursor: "pointer",
        }}
      >
        <MediaQuery smallerThan="xs" styles={{ display: "none" }}>
          <PlusIcon width={40} height={40} />
        </MediaQuery>
        <MediaQuery largerThan="xs" styles={{ display: "none" }}>
          <PlusIcon width={20} height={20} />
        </MediaQuery>
      </Center>
    </BottomNavigationItem>
  );
}
