import {
  FlatList,
  Image,
  SafeAreaView,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { getUserposts, signOut } from "../../lib/appwrite";
import Empty from "../../components/Empty";
import useAppwrite from "../../lib/useAppwrite";
import { icons } from "../../constants";
import Videos from "../../components/Video";
import { useGlobalContext } from "../../authContext";
import Infobox from "../../components/Infobox";
import { router } from "expo-router";

const profile = () => {
  const { user, isLogged, setUser, setIsLogged } = useGlobalContext();
  const { data: posts } = useAppwrite(() => getUserposts(user.$id));

  const logOut = async () => {
    await signOut();
    setUser(null);
    setIsLogged(false);
    router.replace("/signIn");
  };
  const title =()=>{
    if(posts.length===0){
      return '0'
    }else{
      return "3.1k"
    }
  }
  return (
    <SafeAreaView className="flex-1 justify-center bg-primary">
      <FlatList
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => <Videos Video={item} />}
        ListHeaderComponent={() => (
          <View style={{ marginTop: 20, padding: 20 }} className="w-full">
            <TouchableOpacity onPress={logOut} className="items-end w-full">
              <Image
                source={icons.logout}
                style={{ width: 30, height: 40 }}
                resizeMode="contain"
              />
            </TouchableOpacity>

            <View className="items-center justify-center">
              <View className="w-[50] h-[50] item-center justify-center border border-secondary rounded-lg">
                <Image
                  source={{ uri: user?.avatar }}
                  className="w-full h-full rounded-lg"
                  resizeMode="cover"
                />
              </View>
              <Infobox
                title={user?.username || 0}
                titleStyles="text-lg"
                containerStyles="mt-5"
              />
              <View className="items-center justify-center flex flex-row">
                <Infobox
                  title={posts.length}
                  titleStyles="text-lg"
                  subtitle="Posts"
                  containerStyles="mr-5"
                />
                <Infobox title={title()} subtitle="views" titleStyles="text-lg" />
              </View>
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <Empty title="No videos found" subtitle="Create your first video" />
        )}
      />
    </SafeAreaView>
  );
};

export default profile;
