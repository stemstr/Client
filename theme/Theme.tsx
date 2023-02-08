import { MantineThemeOverride } from '@mantine/styles';
import { Tuple, DefaultMantineColor } from '@mantine/core';

type ExtendedCustomColors = 'purple' | DefaultMantineColor;

declare module '@mantine/core' {
  export interface MantineThemeColorsOverride {
    colors: Record<ExtendedCustomColors, Tuple<string, 10>>;
  }
}

const stemstrTheme: MantineThemeOverride = {
  colors: {
    purple: [
      '#EAE2FC', // purple.0
      '#EAE2FC', // purple.1
      '#BFAAEA', // purple.2
      '#BFAAEA', // purple.3
      '#865AE2', // purple.4
      '#865AE2', // purple.5
      '#763AF4', // purple.6
      '#763AF4', // purple.7
      '#41355C', // purple.8
      '#41355C', // purple.9
    ],
    gray: [
      '#FAFAFA', // gray.0
      '#BDBDBD', // gray.1
      '#8A8A8A', // gray.2
      '#8A8A8A', // gray.3
      '#444444', // gray.4
      '#444444', // gray.5
      '#343434', // gray.6
      '#343434', // gray.7
      '#2C2C2C', // gray.8
      '#1E1E1E', // gray.9
    ],
    dark: [
      '#C1C2C5',
      '#A6A7AB',
      '#909296',
      '#5C5F66',
      '#373A40',
      '#2C2E33',
      '#25262B',
      '#2C2C2C',
      '#1E1E1E',
      '#101113',
    ],
  },
  primaryColor: 'purple',
  primaryShade: 6,
  defaultGradient: {
    deg: 142.52,
    from: 'purple.3',
    to: 'purple.6',
  },
  fontFamily:
    'Onest, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji',
  headings: {
    fontFamily:
      'Onest, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji',
  },
};

export default stemstrTheme;
