import React, { useState } from "react";
import { FlatList, ImageBackground, Text, TouchableOpacity, View } from "react-native";
import * as Animatable from 'react-native-animatable';

const zoomIn = {
  0: {
    scale: 0.9
  },
  1: {
    scale: 1
  }
};

const zoomOut = {
  0: {
    scale: 1
  },
  1: {
    scale: 0.9
  }
};

const TrendingItem = ({ activeItem, item, setPlaying, playing }) => {
  return (
    <Animatable.View
      className='mr-3'
      animation={activeItem === item.$id ? zoomIn : zoomOut}
      duration={5000}
    >
      {playing ? (
        <Text className='text-white'>playing</Text>
      ) : (
        <TouchableOpacity
          className="w-full h-60 rounded-xl mt-3 relative items-center justify-center"
          onPress={() => setPlaying(true)}
        >
          <ImageBackground
            source={{
              uri: item.thumbnail
            }}
            className='w-52 h-72 overflow-hidden shadow-lg rounded-[35px]'
          />
        </TouchableOpacity>
      )}
    </Animatable.View>
  );
}

export default function Trendingvideos({ posts }) {
  const [activeItem, setActiveItem] = useState(posts[1]);
  const [playing, setPlaying] = useState(false);

  return (
    <FlatList
      data={posts}
      keyExtractor={(item) => item.$id}
      renderItem={({ item }) => (
        <TrendingItem activeItem={activeItem} item={item} setPlaying={setPlaying} playing={playing} />
      )}
      horizontal
    />
  );
}
