import { createStyles } from '@mantine/core';

const useStyles = createStyles((theme, _params, getRef) => ({
  footer: {
    backgroundColor: theme.colors.dark[8],
    borderTopWidth: 1,
    borderTopStyle: 'solid',
    borderColor: theme.colors.gray[4],
  },
  group: {
    height: '100%',
  },
}));

export default useStyles;
