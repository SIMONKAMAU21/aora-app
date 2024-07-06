import { View, Text, Image } from "react-native";
import React from "react";
import { icons } from "../constants";

const Video = ({ Video: { title, thumbnail, Video, creator } }) => {
  const avatar = creator?.avatar || "default-avatar-url"; // Provide a default avatar URL if avatar is null or undefined
  const username = creator?.username || "Unknown"; // Provide a default username if username is null or undefined

  return (
    <View>
      <View className='mt-10'>
        <View className="justify-center items-center flex-row flex-1 gap-y-1 ">
          <View className="w-[45px] border-secondary h-[45px] border rounded-lg ml-2 ">
            <Image
              source={{ uri: avatar }}
              resizeMode="cover"
              className="w-full h-full rounded-lg"
            />
          </View>
          <View className="flex-1 ml-4">
            <Text className="text-white font-psemibold ">{title}</Text>
            <Text className='text-white font-pregular ' numberOfLines={1}>
                {username}
            </Text>
          </View>
          <View>
            <Image
            source={icons.menu}
            className='w-5 h-5'
            resizeMode="contain"
            />
        </View>
        </View>
        
      </View>
     
    </View>
  );
};

export default Video;
