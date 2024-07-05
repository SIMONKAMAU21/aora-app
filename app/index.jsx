import { View, Text, ScrollView, Image } from "react-native";
import React from "react";
import { Link, router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../constants";
import { Button } from "react-native-paper";
import CustomButton from "../components/CustomButton";

const index = () => {
  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView contentContainerStyle={{ height: "100%" }}>
        <View className=" w-full h-[85vh] justify-center items-center px-4">
          <Image
            source={images.logo}
            className="w-[130px] h-[84px] "
            resizeMode="contain"
          />
          <Image
            source={images.cards}
            className="w-full h-[300px] max-w-[380px]"
          />
          <View className="relative mt-5">
            <Text className="text-4xl text-white font-bold text-center">
              Discover Endless 
               Posibilities with{" "}
              <Text className="text-secondary-200">Aora</Text>
            </Text>
            <Image
            source={images.path}
            className="w-[136px] h-[15px] absolute -bottom-2 -right-8"
            resizeMode="contain"
            />
          </View>
            <Text className='text-gray-100 text-center text-xl font-pregular mt-10'>Where creativity meets innovation:Embark on a journey of limitless Exploration with Aora</Text>
          <CustomButton
          title="Continue with Email"
          handlePress={()=>router.push('/signIn')}
          containerStyles="w-full mt-7"
          />
        </View>
      </ScrollView>
      <StatusBar backgroundColor="#161622" style="light"/>
    </SafeAreaView>
  );
};

export default index;
