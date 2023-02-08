import { AppShell, Footer, Group, Header, Text } from '@mantine/core';
import Link from 'next/link';
import BottomNavigation from '../BottomNavigation/BottomNavigation';

export const ApplicationContainer = ({ children }) => {
  return (
    <AppShell
      styles={{
        root: {
          width: '100%',
          maxWidth: '600px',
          height: '100vh',
          margin: 'auto',
        },
        main: {
          width: '100%',
          //   paddingLeft: '0px',
        },
      }}
      fixed
      footer={<BottomNavigation />}
      //   header={
      //     <Header height={70} p="md">
      //       <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
      //         <Text size="lg" weight="bolder">
      //           Alpaca Activity
      //         </Text>
      //       </div>
      //     </Header>
      //   }
    >
      {children}
    </AppShell>
  );
};
