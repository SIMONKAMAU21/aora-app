import React, { useState } from "react";
import {
  FlatList,
  Image,
  SafeAreaView,
  TouchableOpacity,
  View,
  Text,
  Alert,
  ToastAndroid,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import {
  getUserposts,
  signOut,
  userLikes,
  updateUserProfile,
  uploadToCloudinary,
} from "../../lib/appwrite";
import Ionicons from "@expo/vector-icons/Ionicons";
import Empty from "../../components/Empty";
import useAppwrite from "../../lib/useAppwrite";
import { icons } from "../../constants";
import Videos from "../../components/Video";
import { useGlobalContext } from "../../authContext";
import Infobox from "../../components/Infobox";
import { router } from "expo-router";
import CustomButton from "../../components/CustomButton";

const Profile = () => {
  const { user, setUser, setIsLogged } = useGlobalContext();
  const { data: posts } = useAppwrite(() => getUserposts(user.$id));
  const { data: totalUniqueLikes } = useAppwrite(() =>
    userLikes(user.accountid)
  );
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null); // Holds selected image URI for preview
  const [uploadedImage, setUploadedImage] = useState(user?.avatar); // Holds the uploaded image URI

  const logOut = async () => {
    await signOut();
    setUser(null);
    setIsLogged(false);
    router.replace("/signIn");
  };

  const openPicker = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["image/*"],
      });
      console.log("Document Picker Result:", result);
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setImage(result.assets[0].uri); // Set the URI from the first asset
      } else {
        Alert.alert(
          "Error",
          "No image was picked or the operation was canceled"
        );
      }
    } catch (error) {
      console.error("Error:", error);
      Alert.alert("Error", "Failed to open document picker");
    }
  };

  const onSubmit = async () => {
    try {
      // Ensure that `image` is set to the URI of the picked image
      if (!image) {
        ToastAndroid.show("Please select an image first", ToastAndroid.LONG);
        set
        return;
      }
      setLoading(true);

      // Call the update function with the correct arguments
      const avatarUrl = await uploadToCloudinary(image, "image");
      await updateUserProfile(user.$id, avatarUrl);
      setUploadedImage(avatarUrl);
      ToastAndroid.show("Uploaded Successfully", ToastAndroid.LONG);
      setLoading(false);
    } catch (error) {
      console.warn("Error:", error);
      Alert.alert("Error", "Failed to update profile image");
    }
  };

  return (
    <SafeAreaView className="flex-1 justify-center bg-primary">
      <FlatList
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => <Videos Video={item} Delete={"Delete"} />}
        ListHeaderComponent={() => (
          <View style={{ marginTop: 20, padding: 20 }} className="w-full">
            <View>
              <Text className="text-secondary">
                built with love and owned by @ simon kamau
              </Text>
            </View>
            <TouchableOpacity onPress={logOut} className="items-end w-full">
              <Image
                source={icons.logout}
                style={{ width: 30, height: 40 }}
                resizeMode="contain"
              />
              <Text>log out</Text>
            </TouchableOpacity>

            <View className="items-center justify-center">
              <TouchableOpacity onPress={openPicker}>
                <View
                  style={{
                    width: 100,
                    height: 100,
                    borderRadius: 50, // Half of the width and height for a circular shape
                    alignItems: "center",
                    justifyContent: "center",
                    borderWidth: 1,
                    borderColor: "#ccc", // Optional: Add a border color
                    overflow: "hidden", // Ensures child elements stay within the rounded border
                  }}
                >
                  {/* Profile Image */}
                  {image ? (
                    <Image
                      source={{ uri: image }}
                      style={{
                        width: "100%",
                        height: "100%",
                        borderRadius: 50, // Ensure the image itself is rounded
                      }}
                      resizeMode="cover"
                    />
                  ) : (
                    <Image
                      source={{ uri: uploadedImage }}
                      style={{
                        width: "100%",
                        height: "100%",
                        borderRadius: 50, // Ensure the image itself is rounded
                      }}
                      resizeMode="cover"
                    />
                  )}

                  {/* Icon Overlay */}
                  <View
                    style={{
                      width: "100%",
                      position: "absolute",
                      bottom: 0,
                      alignItems: "center",
                      paddingVertical: 8, // Add some padding for spacing around the icon
                      backgroundColor: "rgba(0, 0, 0, 0.8)", // Slight transparency for the overlay
                      borderBottomLeftRadius: 50,
                      borderBottomRightRadius: 50, // Rounded corners at the bottom
                    }}
                  >
                    <Ionicons
                      name="camera-outline"
                      size={24}
                      color="#FF9C01" // Icon color
                    />
                  </View>
                </View>

                {/* <Text style={{position:"absolute"}} className="mt-2 text-secondary">
                  Change Profile Image
                </Text> */}
              </TouchableOpacity>

              <CustomButton
                textStyles="text-pbold text-sm text-white"
                containerStyles="mt-5"
                title={loading ? "Updating..." : "Update Profile Image"}
                handlePress={onSubmit}
                isLoading={loading}
                disabled={loading}
              />

              <Infobox
                title={user?.username || "Anonymous"}
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
                <Infobox
                  title={totalUniqueLikes || 0}
                  subtitle="Likes"
                  titleStyles="text-lg"
                />
              </View>
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <Empty
            title="No videos found"
            subtitle="Create your first video"
            onPress={() => router.push("/create")}
            buttonTitle={"create one"}
          />
        )}
      />
    </SafeAreaView>
  );
};

export default Profile;
