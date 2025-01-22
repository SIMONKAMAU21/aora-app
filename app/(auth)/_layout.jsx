import { View, Text } from "react-native";
import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { screenOptions } from "../../constants/animation";

const AuthLayout = () => {
  return (
    <>
      <Stack screenOptions={screenOptions}>
        <Stack.Screen
          name="signIn"
          
        />
        <Stack.Screen
          name="signUp"
        />
      </Stack>
      <StatusBar backgroundColor="#161622" style="light" />
    </>
  );
};

export default AuthLayout;
