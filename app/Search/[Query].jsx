import {
  Alert,
  FlatList,
  Image,
  RefreshControl,
  SafeAreaView,
  Text,
  View,
} from "react-native";
import React, { useEffect } from "react";
import { useLocalSearchParams } from "expo-router";
import { searchPosts } from "../../lib/appwrite";
import Search from "../../components/Search";
import Empty from "../../components/Empty";
import useAppwrite from "../../lib/useAppwrite";
import { images } from "../../constants";
import Videos from "../../components/Video";

const SearchPage = () => {
  const { query } = useLocalSearchParams();
  const { data: search, refetch } = useAppwrite(() => searchPosts(query));

  useEffect(() => {
    refetch();
  }, [query]);

  return (
    <SafeAreaView
      style={{ flex: 1, justifyContent: "center", backgroundColor: "black" }}
    >
      <FlatList
        data={search}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => <Videos Video={item} />}
        ListHeaderComponent={() => (
          <View style={{ marginTop: 20, padding: 20 }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 20,
              }}
            >
              <View>
                <Text
                  style={{ fontSize: 14, fontWeight: "500" }}
                  className="text-secondary"
                >
                  Search results
                </Text>
                <Text className="text-white font-psemibold text-lg mt-5">
                  {query}{" "}
                </Text>
              </View>
              <View>
                <Image
                  source={images.logoSmall}
                  style={{ width: 30, height: 40 }}
                  resizeMode="contain"
                />
              </View>
            </View>
            <Search initialQuery={query} />
            {/* <View>
            <Text style={{ fontSize: 20, fontWeight: "500", color: "white", marginTop: 20 }}>Trending videos</Text>
          </View> */}
          </View>
        )}
        ListEmptyComponent={() => (
          <Empty
            title="No videos found"
            subtitle="Be the first one to upload a video"
          />
        )}
      />
    </SafeAreaView>
  );
};

export default SearchPage;
