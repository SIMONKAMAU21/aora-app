import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Video } from 'expo-av';
import { WebView } from 'react-native-webview';
import { icons } from '../constants';

const Videos = ({ Video: { title, thumbnail, video, creator } }) => {
  const avatar = creator?.avatar || 'default-avatar-url'; // Provide a default avatar URL if avatar is null or undefined
  const username = creator?.username || 'Unknown'; // Provide a default username if username is null or undefined
  const [play, setPlay] = useState(false);

  return (
    <View className="mt-10">
      <View className="flex-row items-center gap-y-1">
      <View style={{ width: 40, marginLeft:10, height: 40, borderRadius: 40, overflow: 'hidden', borderWidth: 1, borderColor: '#ccc' }}>
      <Image
        source={{ uri: avatar }}
        style={{ width: '100%', height: '100%' }}
        resizeMode="cover"
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
        <WebView
          style={{ width: '100%', height: 300, borderRadius: 10, marginTop: 10, marginLeft:20 }}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          source={{ uri: video }}
        />
      ) : (
        <TouchableOpacity
          className="w-full h-60 rounded-xl mt-3 relative items-center justify-center"
          onPress={() => setPlay(true)}
        >
          <Image
            source={{ uri: thumbnail }}
            className="w-[390px] h-full rounded-xl"
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

export default Videos;
