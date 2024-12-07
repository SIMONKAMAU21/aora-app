import { Easing, Platform } from 'react-native';

export const screenOptions = {
  headerShown: false,
  presentation: 'card',
  ...(Platform.OS === 'android' && {
    animationEnabled: true,
    transitionSpec: {
      open: {
        animation: 'timing',
        config: {
          duration: 300,
          easing: Easing.out(Easing.poly(5)), // Smooth transition for opening
        },
      },
      close: {
        animation: 'timing',
        config: {
          duration: 300,
          easing: Easing.in(Easing.poly(5)), // Smooth transition for closing
        },
      },
    },

    cardStyleInterpolator: ({ current, layouts, closing }) => ({
      cardStyle: {
        transform: [
          {
            translateY: current.progress.interpolate({
              inputRange: [0, 1],
              outputRange: closing
                ? [0, layouts.screen.width] // Close: left to right
                : [layouts.screen.width, 0], // Open: right to left
            }),
          },
        ],
      },
    }),
  }),
};