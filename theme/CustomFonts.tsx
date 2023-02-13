import { Global } from '@mantine/core';

export function CustomFonts() {
  return (
    <Global
      styles={[
        {
          '@font-face': {
            fontFamily: 'Onest',
            src: `url('/fonts/OnestThin1602-hint.woff') format("woff")`,
            fontWeight: 100,
            fontStyle: 'normal',
          },
        },
        {
          '@font-face': {
            fontFamily: 'Onest',
            src: `url('/fonts/OnestLight1602-hint.woff') format("woff")`,
            fontWeight: 300,
            fontStyle: 'normal',
          },
        },
        {
          '@font-face': {
            fontFamily: 'Onest',
            src: `url('/fonts/OnestRegular1602-hint.woff') format("woff")`,
            fontWeight: 400,
            fontStyle: 'normal',
          },
        },
        {
          '@font-face': {
            fontFamily: 'Onest',
            src: `url('/fonts/OnestMedium1602-hint.woff') format("woff")`,
            fontWeight: 500,
            fontStyle: 'normal',
          },
        },
        {
          '@font-face': {
            fontFamily: 'Onest',
            src: `url('/fonts/OnestBold1602-hint.woff') format("woff")`,
            fontWeight: 700,
            fontStyle: 'normal',
          },
        },
        {
          '@font-face': {
            fontFamily: 'Onest',
            src: `url('/fonts/OnestExtraBold1602-hint.woff') format("woff")`,
            fontWeight: 800,
            fontStyle: 'normal',
          },
        },
        {
          '@font-face': {
            fontFamily: 'Onest',
            src: `url('/fonts/OnestBlack1602-hint.woff') format("woff")`,
            fontWeight: 900,
            fontStyle: 'normal',
          },
        },
      ]}
    />
  );
}
