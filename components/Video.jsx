import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Video } from 'expo-av';
import { icons } from '../constants';

const Videos = ({ Video: { title, thumbnail, video, creator } }) => {
  const avatar = creator?.avatar || 'default-avatar-url';
  const username = creator?.username || 'Unknown';
  const [play, setPlay] = useState(false);
  const videoRef = React.useRef(null);

  console.log("Video URL:", video);
  console.log("Play State:", play);

  return (
    <View className="mt-10">
      <View className="flex-row items-center gap-y-1">
        <View style={{ width: 40, marginLeft: 10, height: 40, borderRadius: 40, overflow: 'hidden', borderWidth: 1, borderColor: '#ccc' }}>
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
        <Video
          ref={videoRef}
          source={{ uri: video }}
          style={{ width: '100%', height: 240, borderRadius: 10, marginTop: 10 }}
          resizeMode="contain"
          useNativeControls
          shouldPlay
          onPlaybackStatusUpdate={(status) => {
            console.log("Playback Status:", status);
            if (status.didJustFinish) {
              setPlay(false);
            }
          }}
        />
      ) : (
        <TouchableOpacity
          style={{ width: '100%', height: 240, borderRadius: 10, marginTop: 10, position: 'relative', justifyContent: 'center', alignItems: 'center' }}
          onPress={() => setPlay(true)}
        >
          <Image
            source={{ uri: thumbnail }}
            style={{ width: '100%', height: '100%', borderRadius: 10 }}
            resizeMode="cover"
          />
          <Image
            source={icons.play}
            style={{ width: 48, height: 48, position: 'absolute' }}
            resizeMode="contain"
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default Videos;
