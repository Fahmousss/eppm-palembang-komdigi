/**
 * iOS-inspired color palette system
 * Based on iOS 15+ system colors
 */

// Color with opacity utility function
export const withOpacity = (hexColor: string, opacity: number): string => {
  // Ensure opacity is between 0 and 1
  const validOpacity = Math.max(0, Math.min(1, opacity))

  // Convert hex to rgba
  if (hexColor.startsWith("#")) {
    const r = Number.parseInt(hexColor.slice(1, 3), 16)
    const g = Number.parseInt(hexColor.slice(3, 5), 16)
    const b = Number.parseInt(hexColor.slice(5, 7), 16)
    return `rgba(${r}, ${g}, ${b}, ${validOpacity})`
  }

  return hexColor
}

// Type definitions
export type ColorShade = "50" | "100" | "200" | "300" | "400" | "500" | "600" | "700" | "800" | "900"

export type ColorCategory = "primary" | "secondary" | "success" | "warning" | "danger" | "gray" | "background" | "text"

export type ColorMode = "light" | "dark"

// iOS system colors (base colors)
export const systemColors = {
  blue: "#007AFF",
  indigo: "#5856D6",
  purple: "#AF52DE",
  pink: "#FF2D55",
  red: "#FF3B30",
  orange: "#FF9500",
  yellow: "#FFCC00",
  green: "#34C759",
  teal: "#5AC8FA",
  cyan: "#32ADE6",
  gray: {
    "1": "#8E8E93",
    "2": "#AEAEB2",
    "3": "#C7C7CC",
    "4": "#D1D1D6",
    "5": "#E5E5EA",
    "6": "#F2F2F7",
  },
  black: "#000000",
  white: "#FFFFFF",
}

// Color palette with shades
export const palette = {
  primary: {
    "50": "#E3F2FD",
    "100": "#BBDEFB",
    "200": "#90CAF9",
    "300": "#64B5F6",
    "400": "#42A5F5",
    "500": systemColors.blue, // iOS blue
    "600": "#0069D9",
    "700": "#0058B7",
    "800": "#004795",
    "900": "#002F6C",
  },
  secondary: {
    "50": "#EDE7F6",
    "100": "#D1C4E9",
    "200": "#B39DDB",
    "300": "#9575CD",
    "400": "#7E57C2",
    "500": systemColors.indigo, // iOS indigo
    "600": "#4D4CB5",
    "700": "#413E9E",
    "800": "#353087",
    "900": "#231F5F",
  },
  success: {
    "50": "#E8F5E9",
    "100": "#C8E6C9",
    "200": "#A5D6A7",
    "300": "#81C784",
    "400": "#66BB6A",
    "500": systemColors.green, // iOS green
    "600": "#2EB350",
    "700": "#259D45",
    "800": "#1C873A",
    "900": "#0F6429",
  },
  warning: {
    "50": "#FFF8E1",
    "100": "#FFECB3",
    "200": "#FFE082",
    "300": "#FFD54F",
    "400": "#FFCA28",
    "500": systemColors.yellow, // iOS yellow
    "600": "#ECBD00",
    "700": "#D9AD00",
    "800": "#C69E00",
    "900": "#A38000",
  },
  danger: {
    "50": "#FEE8E7",
    "100": "#FCBFBC",
    "200": "#FA9991",
    "300": "#F87166",
    "400": "#F65446",
    "500": systemColors.red, // iOS red
    "600": "#E82E23",
    "700": "#D0251B",
    "800": "#B81D14",
    "900": "#8F0E07",
  },
  gray: {
    "50": "#FAFAFA",
    "100": systemColors.gray["6"], // iOS gray 6
    "200": "#EEEEEE",
    "300": systemColors.gray["5"], // iOS gray 5
    "400": systemColors.gray["4"], // iOS gray 4
    "500": systemColors.gray["3"], // iOS gray 3
    "600": systemColors.gray["2"], // iOS gray 2
    "700": systemColors.gray["1"], // iOS gray 1
    "800": "#424242",
    "900": "#212121",
  },
}

// Semantic colors
export const semanticColors = {
  light: {
    background: {
      primary: "#FFFFFF",
      secondary: systemColors.gray["6"],
      tertiary: systemColors.gray["5"],
    },
    text: {
      primary: "#000000",
      secondary: "#3C3C43B3", // 70% opacity
      tertiary: "#3C3C434D", // 30% opacity
      inverse: "#FFFFFF",
    },
    border: systemColors.gray["3"],
    separator: systemColors.gray["4"],
  },
  dark: {
    background: {
      primary: "#000000",
      secondary: "#1C1C1E",
      tertiary: "#2C2C2E",
    },
    text: {
      primary: "#FFFFFF",
      secondary: "#EBEBF599", // 60% opacity
      tertiary: "#EBEBF54D", // 30% opacity
      inverse: "#000000",
    },
    border: "#38383A",
    separator: "#38383A",
  },
}

// Main colors object
export const colors = {
  system: systemColors,
  palette,
  semantic: semanticColors,

  // Convenience accessors for common use cases
  primary: palette.primary["500"],
  secondary: palette.secondary["500"],
  success: palette.success["500"],
  warning: palette.warning["500"],
  danger: palette.danger["500"],

  // Get a specific color shade
  getShade: (category: ColorCategory, shade: ColorShade): string => {
    return palette[category][shade]
  },

  // Get a semantic color based on mode
  getSemantic: (key: string, subKey: string, mode: ColorMode = "light"): string => {
    return semanticColors[mode][key][subKey]
  },

  // Get a color with opacity
  withOpacity,
}

export default colors
