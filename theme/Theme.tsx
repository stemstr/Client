import { MantineThemeOverride } from "@mantine/styles";
import {
  Tuple,
  DefaultMantineColor,
  ActionIconStylesParams,
  ButtonStylesParams,
} from "@mantine/core";

type ExtendedCustomColors = "purple" | DefaultMantineColor;

declare module "@mantine/core" {
  export interface MantineThemeColorsOverride {
    colors: Record<ExtendedCustomColors, Tuple<string, 10>>;
  }
}

const stemstrTheme: MantineThemeOverride = {
  colors: {
    purple: [
      "#EAE2FC", // purple.0
      "#EAE2FC", // purple.1
      "#BFAAEA", // purple.2
      "#BFAAEA", // purple.3
      "#BFAAEA", // purple.4
      "#865AE2", // purple.5
      "#865AE2", // purple.6
      "#763AF4", // purple.7
      "#41355C", // purple.8
      "#41355C", // purple.9
    ],
    green: [
      "#8BF6E3", // green.0
      "#8BF6E3", // green.1
      "#09D4B0", // green.2
      "#09D4B0", // green.3
      "#09D4B0", // green.4
      "#07B898", // green.5
      "#07B898", // green.6
      "#07B898", // green.7
      "#0B6252", // green.8
      "#0B6252", // green.9
    ],
    gray: [
      "#FAFAFA", // gray.0
      "#BDBDBD", // gray.1
      "#8A8A8A", // gray.2
      "#8A8A8A", // gray.3
      "#444444", // gray.4
      "#444444", // gray.5
      "#343434", // gray.6
      "#343434", // gray.7
      "#2C2C2C", // gray.8
      "#1E1E1E", // gray.9
    ],
    dark: [
      "#C1C2C5", // dark.0
      "#A6A7AB", // dark.1
      "#909296", // dark.2
      "#5C5F66", // dark.3
      "#373A40", // dark.4
      "#2C2E33", // dark.5
      "#25262B", // dark.6
      "#2C2C2C", // dark.7
      "#1E1E1E", // dark.8
      "#101113", // dark.9
    ],
  },
  primaryColor: "purple",
  primaryShade: 6,
  defaultGradient: {
    deg: 142.52,
    from: "purple.3",
    to: "purple.6",
  },
  fontFamily:
    "Onest, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji",
  headings: {
    fontFamily:
      "Onest, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji",
  },
  components: {
    TextInput: {
      defaultProps: {
        radius: "md",
      },
      styles: (theme, params) => ({
        input: {
          backgroundColor: theme.colors.dark[7],
          borderColor: theme.colors.gray[4],
          color: theme.colors.gray[2],
          minHeight: 40,
        },
      }),
    },
    PasswordInput: {
      defaultProps: {
        radius: "md",
      },
      styles: (theme, params) => ({
        input: {
          backgroundColor: theme.colors.dark[7],
          borderColor: theme.colors.gray[4],
          color: theme.colors.gray[2],
          minHeight: 40,
        },
        innerInput: {
          minHeight: 40,
        },
      }),
    },
    Button: {
      styles: (theme, params: ButtonStylesParams) => ({
        root: {
          // width: "100%",
          borderRadius: theme.radius.md,
          minHeight: 40,
          backgroundColor:
            params.variant === "default"
              ? theme.colors.purple[4]
              : params.variant === "light"
              ? theme.colors.gray[6]
              : undefined,
          color: params.variant === "light" ? theme.white : undefined,
          "&hover": {
            backgroundColor:
              params.variant === "default" ? theme.colors.purple[7] : undefined,
          },
          ":disabled": {
            backgroundColor:
              params.variant === "default" ? theme.colors.gray[4] : undefined,
          },
        },
        label: {
          fontWeight: 500,
        },
      }),
    },
    ActionIcon: {
      defaultProps: {
        variant: "default",
        color: "white",
      },
      styles: (theme, params: ActionIconStylesParams) => ({
        root: {
          backgroundColor: "transparent !important",
          border: "none",
        },
      }),
    },
  },
};

export default stemstrTheme;
