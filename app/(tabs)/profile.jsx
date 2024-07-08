import { Alert, FlatList, Image, RefreshControl, SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect } from 'react';
import { getUserposts, searchPosts } from "../../lib/appwrite";
import Empty from "../../components/Empty";
import useAppwrite from "../../lib/useAppwrite";
import { icons } from "../../constants";
import Videos from "../../components/Video";
import  { useGlobalContext } from "../../authContext";

const profile = () => {
  const {user,isLogged,setUser ,setIsLogged} = useGlobalContext()
  const { data: posts } = useAppwrite(()=> getUserposts(user.$id));

 
  return (
    <SafeAreaView style={{ flex: 1, justifyContent: "center", backgroundColor: "black" }}>
    <FlatList
    
      data={posts}
      keyExtractor={(item) => item.$id}
      renderItem={({ item }) => <Videos Video={item} />}
      ListHeaderComponent={() => (
        <View style={{ marginTop: 20, padding: 20 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 10 }}>
            <View>
              <Text style={{ fontSize: 14, fontWeight: "500",  }} className='text-secondary'>Search results</Text>
              {/* <Text className='text-white font-psemibold text-lg mt-5' >{query} </Text> */}
            </View>
            <TouchableOpacity>
              <Image
                source={icons.logout}
                style={{ width: 30, height: 40 }}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
         
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

export default profile;
