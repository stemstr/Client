import { Box, Center, Footer, Group, Text } from '@mantine/core';
import Link from 'next/link';
import useStyles from './BottomNavigation.styles';
import BottomNavigationItem from '../BottomNavigationItem/BottomNavigationItem';

export default function BottomNavigation() {
  const { classes } = useStyles();

  return (
    <Footer
      height={88}
      p="md"
      styles={{
        root: {
          width: '100%',
          maxWidth: 600,
          left: 'unset',
          right: 'unset',
        },
      }}
      className={classes.footer}
    >
      <Group position="apart" align="center" spacing="xl" className={classes.group}>
        <BottomNavigationItem>
          <Link href="/">
            <Text size={24}>🏠</Text>
          </Link>
        </BottomNavigationItem>
        <BottomNavigationItem>
          <Link href="/discover">
            <Text size={24}>🔍</Text>
          </Link>
        </BottomNavigationItem>
        <BottomNavigationItem>
          <Center
            sx={{
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              backgroundColor: 'white',
            }}
          >
            <Text size={24}>➕</Text>
          </Center>
        </BottomNavigationItem>
        <BottomNavigationItem>
          <Link href="/collections">
            <Text size={24}>📚</Text>
          </Link>
        </BottomNavigationItem>
        <BottomNavigationItem>
          <Link href="/profile">
            <Text size={24}>😎</Text>
          </Link>
        </BottomNavigationItem>
      </Group>
    </Footer>
  );
}
