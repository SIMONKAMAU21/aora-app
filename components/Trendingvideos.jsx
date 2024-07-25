import React, { useState } from "react";
import { FlatList, Image, ImageBackground, TouchableOpacity, View, StyleSheet } from "react-native";
import * as Animatable from "react-native-animatable";
import { Video } from "expo-av";
import { icons } from "../constants";

const zoomIn = {
  0: {
    scale: 0.9,
  },
  1: {
    scale: 1,
  },
};

const zoomOut = {
  0: {
    scale: 1,
  },
  1: {
    scale: 0.8,
  },
};

const TrendingItem = ({ activeItem, item, setPlaying, playing }) => {
  return (
    <Animatable.View
      style={[styles.trendingItem, activeItem === item.$id && styles.activeItem]}
      animation={activeItem === item.$id ? zoomIn : zoomOut}
      duration={500}
    >
      {playing ? (
        <Video
          style={styles.video}
          resizeMode="contain"
          useNativeControls
          shouldPlay
          source={{ uri: item.video }}
        />
      ) : (
        <TouchableOpacity
          style={styles.thumbnailContainer}
          onPress={() => setPlaying(true)}
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
  const [playing, setPlaying] = useState(false);

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
          setPlaying={setPlaying}
          playing={playing}
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
    marginRight: 3,
  },
  activeItem: {
  
  },
  video: {
    width: 350,
    height: 200,
    borderRadius: 10,
    marginTop: 10,
  },
  thumbnailContainer: {
    width: 350,
    height: 200,
    borderRadius: 35,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderWidth: 2,
    // borderColor: "red",
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
    paddingLeft: 170,
  },
});
