import { Easing } from "react-native-reanimated";

export const screenOptions = {
  gestureEnabled: true,
  headerShown: false,
  transitionSpec: {
    open: {
      animation: "timing",
      config: {
        duration: 10000,
        easing: Easing.out(Easing.ease),
      },
    },
    close: {
      animation: "timing",
      config: {
        duration: 10000,
        easing: Easing.in(Easing.ease),
      },
    },
  },
  cardStyleInterpolator: ({ current, layouts }) => ({
    cardStyle: {
      transform: [
        {
          translateX: current.progress.interpolate({
            inputRange: [0, 0.1],
            outputRange: [layouts.screen.width, 0], // Right-to-left animation
          }),
        },
      ],
    },
  }),
};
