import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { icons } from "../constants";

const Video = ({ Video: { title, thumbnail, Video, creator } }) => {
  const avatar = creator?.avatar || "default-avatar-url"; // Provide a default avatar URL if avatar is null or undefined
  const username = creator?.username || "Unknown"; // Provide a default username if username is null or undefined
  const [play, setPlay] = useState(false);

  return (
    <View className="mt-10">
      <View className="flex-row items-center gap-y-1">
        <View className="w-11 h-11 border border-gray-300 rounded-lg ml-2">
          <Image
            source={{ uri: avatar }}
            resizeMode="cover"
            className="w-full h-full rounded-lg"
          />
        </View>
        <View className="flex-1 ml-4">
          <Text className="text-white font-semibold">{title}</Text>
          <Text className="text-white" numberOfLines={1}>
            {username}
          </Text>
        </View>
        <View>
          <Image
            source={icons.menu}
            className="w-5 h-5"
            resizeMode="contain"
          />
        </View>
      </View>
        {play ? (
          <Text className="text-white">playing</Text>
        ) : (
          <TouchableOpacity
            className="w-full h-60 rounded-xl mt-3 relative items-center justify-center"
            // onPress={() => setPlay(true)}
          >
            <Image
              source={{ uri: thumbnail }}
              className="w-full h-full rounded-xl"
              resizeMode="cover"
            />
            <Image
              source={icons.play}
              className="w-12 h-12 absolute"
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}
    </View>
  );
};

export default Video;
