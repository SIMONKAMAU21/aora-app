import React, { useState } from "react";
import { FlatList, Image, ImageBackground, TouchableOpacity, View } from "react-native";
import * as Animatable from "react-native-animatable";
import { Video } from "expo-av";
import { icons } from "../constants";
import WebView from "react-native-webview";

const zoomIn = {
  0: {
    scale: 0.9,
  },
  1: {
    scale: 1.1,
  },
};

const zoomOut = {
  0: {
    scale: 1,
  },
  1: {
    scale: 0.9,
  },
};

const TrendingItem = ({ activeItem, item, setPlaying, playing }) => {
  return (
    <Animatable.View
      style={{ marginRight: 3, marginTop: 10 }}
      animation={activeItem === item?.$id ? zoomIn : zoomOut}
      duration={500}
    >
      {playing ? (
         <Video
         style={{ width: '100%', height: 300, borderRadius: 10, marginTop: 10 }}
         resizeMode="contain"
         useNativeControls
         shouldPlay
         source={{ uri:item.video }}
       />
      ) : (
        <TouchableOpacity
          style={{
            width: 240,
            height: 180,
            borderRadius: 35,
            
            backgroundColor:'white',
            overflow: "hidden",
          }}
          onPress={() => setPlaying(true)}
        >
          <ImageBackground
            source={{ uri: item.thumbnail }}
            style={{ width: '100%', height: '100%', overflow: "hidden", borderRadius: 35 }}
            resizeMode="cover"
          >
            <Image
              source={icons.play}
              style={{ width: 50, height: 50, position: "absolute", top: "50%", left: "50%", transform: [{ translateX: -25 }, { translateY: -25 }] }}
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
      contentOffset={{ x: 170 }}
      horizontal
    />
  );
}
