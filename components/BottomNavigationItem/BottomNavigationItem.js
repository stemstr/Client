import { Anchor, Center } from "@mantine/core";
import Link from "next/link";

export default function BottomNavigationItem({ children, href }) {
  const inner = <Center style={{ width: 36, height: 36 }}>{children}</Center>;

  if (href)
    return (
      <Anchor component={Link} c="gray.2" href={href}>
        {inner}
      </Anchor>
    );
  else {
    return inner;
  }
}
