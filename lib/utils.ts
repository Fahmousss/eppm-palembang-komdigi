/**
 * A utility function to conditionally join class names together
 * Useful for combining Tailwind/NativeWind classes conditionally
 */
export function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ")
}
