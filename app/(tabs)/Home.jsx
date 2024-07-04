import { Link } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {  View } from "react-native";
import { ActivityIndicator, Searchbar, Text } from "react-native-paper";

export default function HomeScreen() {
  return (
    <View className="flex-1 items-center justify-center ">
      <Searchbar />
      <StatusBar style="auto"/>
      <Text className="text-3xl font-pblack " >hey my name is simon kamau</Text>
    </View>
  );
}

