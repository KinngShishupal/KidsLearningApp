import { useColorScheme as useRNColorScheme } from 'react-native';

/**
 * React Native reports 'unspecified' when no scheme is set; treat it like null
 * so callers can fall back with `?? 'light'`.
 */
export function useColorScheme() {
  const colorScheme = useRNColorScheme();
  return colorScheme === 'unspecified' ? null : colorScheme;
}
