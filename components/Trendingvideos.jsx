import React, { useState } from "react";
import { FlatList, Image, ImageBackground, TouchableOpacity, View, StyleSheet } from "react-native";
import * as Animatable from "react-native-animatable";
import { Video } from "expo-av";
import { icons } from "../constants";

const zoomIn = {
  0: {
    scale: 0.7,
  },
  1: {
    scale: 1,
  },
};

const zoomOut = {
  0: {
    scale: 0.9,
  },
  1: {
    scale: 0.9,
  },
};

const TrendingItem = ({ activeItem, item,playingItem, setPlaying }) => {
  const isPlaying = playingItem === item.$id
  return (
    <Animatable.View
      style={[styles.trendingItem, activeItem === item.$id && styles.activeItem]}
      animation={activeItem === item.$id ? zoomIn : zoomOut}
      duration={1000}
    >
      {isPlaying ? (
        <Video
          style={styles.video}
          resizeMode="contain"
          // useNativeControls
          shouldPlay
          source={{ uri: item.video }}
        
        />
      ) : (
        <TouchableOpacity
          style={styles.thumbnailContainer}
          onPress={() => setPlaying(item.$id)}
        >
          <ImageBackground
            source={{ uri: item.thumbnail }}
            style={styles.thumbnail}
            resizeMode="cover"
          >
            <Image
              source={icons.play}
              style={styles.playIcon}
              resizeMode="contain"
            />
          </ImageBackground>
        </TouchableOpacity>
      )}
    </Animatable.View>
  );
};

export default function TrendingVideos({ posts }) {
  const [activeItem, setActiveItem] = useState(posts?.length > 0 ? posts[0].$id : null);
  const [playing, setPlaying] = useState(null);

  const viewableChanges = ({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setActiveItem(viewableItems[0].key);
    }
  };

  return (
    <FlatList
      data={posts}
      keyExtractor={(item) => item.$id}
      renderItem={({ item }) => (
        <TrendingItem
          activeItem={activeItem}
          item={item}
          playingItem={playing}
          setPlaying={setPlaying}
        />
      )}
      onViewableItemsChanged={viewableChanges}
      viewabilityConfig={{
        itemVisiblePercentThreshold: 70,
      }}
      horizontal
      contentContainerStyle={styles.flatListContainer}
    />
  );
}

const styles = StyleSheet.create({
  trendingItem: {
    marginRight: 1,
  },
  activeItem: {
    borderColor: "blue",
      borderColor: "deepskyblue",
  // borderWidth: 3,
    shadowColor: "deepskyblue",
    shadowOffset: { width: 10, height: 600 },
    shadowOpacity: 0,
    

  },
  video: {
    width: "100%",
    height: 250,
    borderRadius: 10,
    borderColor: "teal",
    // marginTop: 9/16,
    aspectRatio: 9/ 16,
  },
  thumbnailContainer: {
    width: 168,
    height: 268,
    borderRadius: 14,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    // borderWidth: 1,
    borderColor: "teal",
    padding:"auto"
  },
  thumbnail: {
    width: "100%",
    height: "100%",
  },
  playIcon: {
    width: 50,
    height: 50,
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -25 }, { translateY: -25 }],
  },
  flatListContainer: {
    paddingLeft: 10,
  },
});
