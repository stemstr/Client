import { Center } from "@mantine/core";

interface ProfileActionButtonProps {
  onClick?: () => void;
}

export default function ProfileActionButton({
  children,
  onClick,
}: React.PropsWithChildren<ProfileActionButtonProps>) {
  return (
    <Center
      sx={(theme) => ({
        height: 34,
        padding: "8px 16px",
        borderRadius: theme.radius.md,
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: theme.colors.gray[4],
        backgroundColor: theme.colors.gray[6],
        color: theme.white,
        cursor: "pointer",
        fontSize: theme.fontSizes.sm,
        fontWeight: 500,
        lineHeight: "normal",
      })}
      onClick={onClick}
    >
      {children}
    </Center>
  );
}
