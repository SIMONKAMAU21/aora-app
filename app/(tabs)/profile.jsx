import React, { useState } from 'react';
import {
  FlatList,
  Image,
  SafeAreaView,
  TouchableOpacity,
  View,
  Text,
  Alert,
  ToastAndroid,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getUserposts, signOut, userLikes, uploadProfileImage, updateUserProfile } from '../../lib/appwrite';
import Empty from '../../components/Empty';
import useAppwrite from '../../lib/useAppwrite';
import { icons } from '../../constants';
import Videos from '../../components/Video';
import { useGlobalContext } from '../../authContext';
import Infobox from '../../components/Infobox';
import { router } from 'expo-router';

const Profile = () => {
  const { user, setUser, setIsLogged } = useGlobalContext();
  const { data: posts } = useAppwrite(() => getUserposts(user.$id));
  const { data: totalUniqueLikes } = useAppwrite(() => userLikes(user.accountid));

  const [image, setImage] = useState(null); // State for storing the picked image

  const logOut = async () => {
    await signOut();
    setUser(null);
    setIsLogged(false);
    router.replace('/signIn');
  };

  // const pickImage = async () => {
  //   const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
  //   if (status !== 'granted') {
  //     Alert.alert('Permission required', 'Sorry, we need camera roll permissions to make this work!');
  //     return null;
  //   }
  
  //   const result = await ImagePicker.launchImageLibraryAsync({
  //     mediaTypes: ImagePicker.MediaTypeOptions.Images,
  //     allowsEditing: true,
  //     aspect: [4, 3],
  //     quality: 1,
  //   });
  
  //   console.log('ImagePicker result:', result); // Log the result for debugging
  
  //   if (!result.canceled && result.assets.length > 0) {
  //     return result.assets[0]; // Return the first asset
  //   }
  
  //   return null;
  // };
  

  // const handleChangeProfileImage = async () => {
  //   try {
  //     // Pick an image
  //     const result = await pickImage();
  //     console.log('Selected Image Result:', result);
    
  //     if (result) {
  //       // Prepare the file details
  //       const fileDetails = {
  //         mimeType: result.type || 'image/jpeg',
  //         uri: result.uri.startsWith('file://') ? result.uri : `file://${result.uri}`,
  //       };
    
  //       // Upload the profile image and get the URL
  //       const imageUrl = await uploadProfileImage(fileDetails);
  //       console.log('Uploaded Image URL:', imageUrl);
    
  //       // Update user profile and get the response
  //       const updateResponse = await updateUserProfile(user.$id, imageUrl);
  //       console.log('Profile Update Response:', updateResponse);
    
  //       // Update the user state
  //       setUser((prev) => ({ ...prev, avatar: imageUrl }));
  
  //       // Show success alert
  //       Alert.alert('Success', updateResponse.message);
  //     } else {
  //       Alert.alert('Error', 'No image selected');
  //     }
  //   } catch (error) {
  //     console.error('Error:', error);
  //     Alert.alert('Error', 'Failed to update profile image');
  //   }
  // };
  
  const comingSoon = () =>{
    ToastAndroid.show("Feature is coming soon",ToastAndroid.LONG)
  }
  
  

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
              <TouchableOpacity >
                <View className="w-[50] h-[50] item-center justify-center border border-secondary rounded-lg">
                  <Image
                    source={{ uri: user?.avatar }}
                    className="w-full h-full rounded-lg"
                    resizeMode="cover"
                  />
                </View>
                <Text className="mt-2 text-secondary">Change Profile Image</Text>
              </TouchableOpacity>

              <TouchableOpacity className="mt-4 bg-secondary p-2 rounded" onPress={comingSoon}>
                <Text className="text-white font-bold text-center">Update Profile Image</Text>
              </TouchableOpacity>

              <Infobox
                title={user?.username || 'Anonymous'}
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
            onPress={() => router.push('/create')}
            buttonTitle={"create one"}
          />
        )}
      />
    </SafeAreaView>
  );
};

export default Profile;
