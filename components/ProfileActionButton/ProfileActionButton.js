import { Anchor, Center } from "@mantine/core";
import Link from "next/link";

export default function ProfileActionButton({ children, onClick }) {
  return (
    <Center
      sx={(theme) => ({
        padding: "8px 16px",
        borderRadius: theme.radius.xl,
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: theme.white,
        backgroundColor: theme.colors.dark[7],
        color: theme.white,
        cursor: "pointer",
        fontSize: 12,
        fontWeight: 500,
        lineHeight: "normal",
      })}
      onClick={onClick}
    >
      {children}
    </Center>
  );
}
