import React, { useState, useRef } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Video } from 'expo-av';
import { icons } from '../constants';

const Videos = ({ Video: { prompt,title, thumbnail, video, creator } }) => {
  const avatar = creator?.avatar || 'default-avatar-url';
  const username = creator?.username || 'Unknown';
  const [play, setPlay] = useState(false);
  const videoRef = useRef(null);

  const handlePlaybackStatusUpdate = (status) => {
    if (status.didJustFinish) {
      setPlay(false);
    }
  };

  const handlePlayPress = () => {
   
    setPlay(true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Image
            source={{ uri: avatar }}
            style={styles.avatar}
            resizeMode="cover"
          />
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.username} numberOfLines={1}>
            {username}
          </Text>
        </View>
        <Image
          source={icons.menu}
          style={styles.menuIcon}
          resizeMode="contain"
        />
      </View>
      {play ? (
        <Video
          ref={videoRef}
          source={{ uri: video }}
          style={styles.video}
          resizeMode="contain"
          useNativeControls
          shouldPlay
          onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
          onError={(error) => console.log("Video Error:", error)}
        />
      ) : (
        <TouchableOpacity
          style={styles.thumbnailContainer}
          onPress={handlePlayPress}
        >
          <Image
            source={{ uri: thumbnail }}
            style={styles.thumbnail}
            resizeMode="cover"
          />
          <Image
            source={icons.play}
            style={styles.playIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    padding:10
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 40,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ccc',
    marginLeft: 10,
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  infoContainer: {
    flex: 1,
    marginLeft: 4,
  },
  title: {
    color: 'white',
    fontWeight: 'bold',
  },
  username: {
    color: 'white',
  },
  menuIcon: {
    width: 20,
    height: 20,
  },
  video: {
    width: '100%',
    height: 240,
    borderRadius: 10,
    marginTop: 10,
  },
  thumbnailContainer: {
    width: '100%',
    height: 240,
    borderRadius: 10,
    marginTop: 10,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  playIcon: {
    width: 48,
    height: 48,
    position: 'absolute',
  },
});

export default Videos;
