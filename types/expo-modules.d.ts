declare module 'expo-font' {
  export function useFonts(map: string | Record<string, any>): [boolean, Error | null];
}
declare module 'expo-splash-screen' {
  export function preventAutoHideAsync(): Promise<boolean>;
  export function hideAsync(): Promise<boolean>;
}
declare module 'expo-router' {
  export function useRouter(): any;
  export function useLocalSearchParams<T = any>(): T;
  export function useGlobalSearchParams<T = any>(): T;
  export function useSegments(): any;
  export function useFocusEffect(callback: () => void): void;
  export const ErrorBoundary: any;
  export const Stack: any;
  export const Tabs: any;
  export const Link: any;
}
declare module '@expo/vector-icons' {
  export const MaterialIcons: any;
  export const FontAwesome: any;
  export const Ionicons: any;
}
declare module '@expo/vector-icons/MaterialIcons' {
  const MaterialIcons: any;
  export default MaterialIcons;
}
declare module '@expo/vector-icons/FontAwesome' {
  const FontAwesome: any;
  export default FontAwesome;
}


