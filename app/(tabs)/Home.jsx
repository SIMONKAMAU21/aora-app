import { Alert, FlatList, Image, RefreshControl, SafeAreaView, View } from "react-native";
import { Text,  Badge } from "react-native-paper";
import { images } from "../../constants";
import Trendingvideos from "../../components/Trendingvideos";
import Empty from "../../components/Empty";
import { useEffect, useState } from "react";
import { getLatestPosts, getPosts, getCurrentUser } from "../../lib/appwrite"; 
import useAppwrite from "../../lib/useAppwrite";
import Videos from "../../components/Video";
import Search from "../../components/Search";
import { router } from "expo-router";

export default function HomeScreen() {
  const { data: posts, refetch } = useAppwrite(getPosts);
  const { data: latestPosts } = useAppwrite(getLatestPosts);
  const [refreshing, setRefreshing] = useState(false);
  const [username, setUsername] = useState("User"); 

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const user = await getCurrentUser();
        if (user) {
          setUsername(user.username); 
        }
      } catch (error) {
        console.error("Error fetching current user:", error);
      }
    };

    fetchCurrentUser();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };
 const handleDelete = async() =>{
  await refetch()
 }


  return (
    <SafeAreaView style={{ flex: 1, justifyContent: "center", }}className="bg-primary" >
      <FlatList
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => <Videos Video={item} onDelete={handleDelete} />}
        ListHeaderComponent={() => (
          <View style={{ marginTop: 10, padding: 20 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 20 }}>
              <View>
                <Text style={{ fontSize: 14, fontWeight: "500",  }} className='text-secondary'>Welcome back</Text>
                <Text style={{ fontSize: 32, fontWeight: "bold", color: "white" }}>{username}</Text>
              </View>
              {latestPosts ? <Badge style={{backgroundColor:"orange",color:"white",left:"430px"}}>{latestPosts.length} </Badge> :<Badge > 0</Badge>}
              <View>
                <Image
                  source={images.logoSmall}
                  style={{ width: 30, height: 40 }}
                  resizeMode="contain"
                />
              </View>
            </View>
            <Search />
            
            <View>
              <Text style={{ fontSize: 20, fontWeight: "500", color: "white", marginTop: 20 }}>Trending videos</Text>
              <Trendingvideos posts={latestPosts ?? []} />
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <Empty
            title="No videos found"
            subtitle="Be the first one to upload a video"
            buttonTitle={"create one"}
            onPress={()=> router.push('/create')}
            
          />
        )}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
    </SafeAreaView>
  );
}
