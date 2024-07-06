import { FlatList, Text, View } from "react-native";

export default function Trendingvideos({ posts }) {
  return (
    <FlatList
      data={posts}
      keyExtractor={(item)=> item.$id}
      renderItem={({ item }) => <Text className="text-white text-3xl">{item.id}</Text>}
      horizontal
    />
  );
}
