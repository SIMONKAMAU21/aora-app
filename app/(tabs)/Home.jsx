import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  RefreshControl,
  SafeAreaView,
  View,
} from "react-native";
import { Text, Badge } from "react-native-paper";
import { images } from "../../constants";
import Trendingvideos from "../../components/Trendingvideos";
import Empty from "../../components/Empty";
import { getLatestPosts, getPosts, getCurrentUser } from "../../lib/appwrite";
import useAppwrite from "../../lib/useAppwrite";
import Videos from "../../components/Video";
import Search from "../../components/Search";
import { router } from "expo-router";
import { VideoProvider } from "../../videoContext";

const HomeScreen = () => {
  const { data: posts, refetch } = useAppwrite(getPosts);
  const { data: latestPosts } = useAppwrite(getLatestPosts);
  const [refreshing, setRefreshing] = useState(false);
  const [username, setUsername] = useState("User");
  const [userimage, setUserimage] = useState("user");

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const user = await getCurrentUser();
        console.log("user", user);
        if (user) {
          setUsername(user.username);
          setUserimage(user?.avatar);
        }
      } catch (error) {
        console.error("Error fetching current user:", error);
      }
    };
  
    fetchCurrentUser();
  }, []); // Runs once on mount
  
  // Include in your onRefresh function:
  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    await getCurrentUser(); // Optional: if you want to refetch user data on refresh
    setRefreshing(false);
  };
  

  const handleDelete = async () => {
    await refetch();
  };

  return (
    <VideoProvider>
      <SafeAreaView
        style={{ flex: 1, justifyContent: "center" }}
        className="bg-primary"
      >
        <View
          style={{
            marginTop: 10,
            padding: 20,
            position: "relative",
            zIndex: 1000,
            height:90,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 20,
            }}
          >
            <View style={{ border: "2px solid red" }}>
              <Text
                style={{ fontSize: 14, fontWeight: "500" }}
                className="text-secondary"
              >
                Welcome back
              </Text>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  padding: "10px",
                }}
              >
                <Text
                  style={{ fontSize: 32, fontWeight: "bold", color: "white" }}
                >
                  {username}
                </Text>
                <View
                  style={{
                    width: 40,
                    height: 40,
                    backgroundColor: "red",
                    borderRadius: 20, // Half of the width and height
                    alignItems: "center",
                    justifyContent: "center",
                    borderWidth: 1,
                  }}
                >
                  <Image
                    source={{ uri: userimage }}
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: 25, // Ensure the image itself is rounded
                    }}
                    resizeMode="cover"
                  />
                </View>
              </View>
            </View>
            {latestPosts ? (
              <Badge
                style={{
                  backgroundColor: "orange",
                  color: "white",
                  left: "430px",
                }}
              >
                {latestPosts.length}{" "}
              </Badge>
            ) : (
              <Badge> 0</Badge>
            )}
            <View>
              <Image
                source={images.logoSmall}
                style={{ width: 30, height: 40 }}
                resizeMode="contain"
              />
            </View>
          </View>
        </View>
        <FlatList
          data={posts}
          keyExtractor={(item) => item.$id}
          renderItem={({ item }) => (
            <Videos Video={item} onDelete={handleDelete} />
          )}
          ListHeaderComponent={() => (
            <>
              <Search />
              <View>
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: "500",
                    color: "white",
                    marginTop: 5,
                  }}
                >
                  Trending videos
                </Text>
                <Trendingvideos posts={latestPosts ?? []} />
              </View>
            </>
          )}
          ListEmptyComponent={() => (
            <Empty
              title="No videos found"
              subtitle="Be the first one to upload a video"
              buttonTitle={"create one"}
              onPress={() => router.push("/create")}
            />
          )}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      </SafeAreaView>
    </VideoProvider>
  );
};

export default HomeScreen;
