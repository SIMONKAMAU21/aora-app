import { Link } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  FlatList,
  Image,
  RefreshControl,
  SafeAreaView,
  View,
} from "react-native";
import { ActivityIndicator, Searchbar, Text } from "react-native-paper";
import { images } from "../../constants";
import Trendingvideos from "../../components/Trendingvideos";
import Empty from "../../components/Empty";
import { useEffect, useState } from "react";
import { getPosts } from "../../lib/appwrite";
import useAppwrite from "../../lib/useAppwrite";
import Video from "../../components/Video";

export default function HomeScreen() {
  const { data: posts, isLoading, refetch } = useAppwrite(getPosts);

  console.log("posts", posts);
  const [refreshing, setreFreshing] = useState(false);

  const onRefresh = async () => {
    setreFreshing(true);

    await refetch();

    setreFreshing(false);
  };
  return (
    <SafeAreaView className="flex-1  justify-center text-black bg-primary  ">
      <FlatList
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
          <Video Video={item}/>
        )}
        ListHeaderComponent={() => (
          <View className="my-6 px-4 space-y-6 mt-10">
            <View className="justify-between items-start mb-6 flex-row">
              <View className="">
                <Text className="text-sm font-pmedium">welcome back</Text>
                <Text className="font-pbold text-4xl">simon</Text>
              </View>
              <View>
                <Image
                  source={images.logoSmall}
                  className="w-9 h-10"
                  resizeMode="contain"
                />
              </View>
            </View>
            <Searchbar placeholder="search here..." />
            <View>
              <Text className="text-lg font-pregular">Trending videos</Text>
              <Trendingvideos posts={[{ id: 1 }, { id: 2 }, { id: 3 }] ?? []} />
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <Empty
            title="No vedios found"
            subtitle="Be the first one to upload a vedio"
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </SafeAreaView>
  );
}
