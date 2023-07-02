import { Center, DefaultProps } from "@mantine/core";
import useStyles from "components/ProfileActionButton/ProfileActionButton.styles";
import { MouseEventHandler } from "react";

interface ProfileActionButtonProps extends DefaultProps {
  onClick?: MouseEventHandler<HTMLDivElement>;
}

export default function ProfileActionButton({
  onClick,
  className,
  children,
  ...rest
}: React.PropsWithChildren<ProfileActionButtonProps>) {
  const { classes, cx } = useStyles();

  // TODO: Convert this to a <Button />
  return (
    <Center onClick={onClick} className={cx(classes.root, className)} {...rest}>
      {children}
    </Center>
  );
}
