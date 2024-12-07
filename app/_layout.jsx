import { SplashScreen, Stack } from "expo-router";
import "react-native-reanimated";
import { PaperProvider } from "react-native-paper";
import { useFonts } from "expo-font";
import { useEffect } from "react";
import GlobalProvider from "../authContext";
import { VideoProvider } from "../videoContext";
import { screenOptions } from "../constants/animation";

SplashScreen.preventAutoHideAsync();
export default function RootLayout() {
  const [fonstLoaded, error] = useFonts({
    "Poppins-Black": require("../assets/fonts/Poppins-Black.ttf"),
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
    "Poppins-ExtraBold": require("../assets/fonts/Poppins-ExtraBold.ttf"),
    "Poppins-ExtraLight": require("../assets/fonts/Poppins-ExtraLight.ttf"),
    "Poppins-Light": require("../assets/fonts/Poppins-Light.ttf"),
    "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
    "Poppins-Thin": require("../assets/fonts/Poppins-Thin.ttf"),
  });

  useEffect(() => {
    if (error) throw error;
    if (fonstLoaded) SplashScreen.hideAsync();
  }, [fonstLoaded, error]);
  if (!fonstLoaded && !error) return null;
  return (
    <GlobalProvider>
      <VideoProvider>
        <PaperProvider>
          <Stack>
            <Stack.Screen name="index" options={screenOptions} />
            <Stack.Screen name="(auth)" options={screenOptions} />
            <Stack.Screen name="(tabs)" options={screenOptions} />
            <Stack.Screen
              name="Search/[query]"
              options={{ headerShown: false }}
            />
          </Stack>
        </PaperProvider>
      </VideoProvider>
    </GlobalProvider>
  );
}
