import React, { useState } from "react";
import { View, Text, FlatList, StyleSheet, SafeAreaView, RefreshControl } from "react-native";
import { fetchLikedVideos } from "../../lib/appwrite";
import useAppwrite from "../../lib/useAppwrite";
import Videos from "../../components/Video"; // Ensure this path is correct
import Empty from "../../components/Empty";
import { router } from "expo-router";

const Saved = () => {
  const { data: savedData, error, isLoading,refetch } = useAppwrite(fetchLikedVideos);
  const saved = savedData?.documents || [];
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };
  if (isLoading) {
    return (
      <View style={styles.loadingContainer} className="bg-primary">
        <Text className="text-white">Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text>Error: {error.message}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} className="bg-primary">
      <FlatList
        data={saved}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => <Videos Video={item} />}
        ListEmptyComponent={() => (
          <Empty
            title={"no saved videos"}
            subtitle="videos saved from home page will appear here"
            buttonTitle={"save"}
            onPress={()=> router.push('/Home')}
          />
        )}
        ListHeaderComponent={() => (
          <View className="mt-5 p-5">
            <Text className="text-white font-pbold">Saved videos</Text>
          </View>
        )}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Saved;
