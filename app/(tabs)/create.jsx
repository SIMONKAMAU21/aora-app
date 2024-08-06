import { useState } from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, Image, Alert, ToastAndroid } from 'react-native';
import { ResizeMode, Video } from 'expo-av';
import * as DocumentPicker from 'expo-document-picker';
import { router } from 'expo-router';
import Inputs from '../../components/InputFields';
import CustomButton from '../../components/CustomButton';
import icons from '../../constants/icons';
import { useGlobalContext } from '../../authContext';
import { createVideo } from '../../lib/appwrite'; // Ensure this import is correct

// const CLOUDINARY_UPLOAD_PRESET = 'wdfjbcug'; // Set your upload preset
// const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/diyuy63ue/video/upload"; // Replace with your Cloudinary URL

const Create = ({ onSuccess }) => {
  const { user } = useGlobalContext();
  const [isUploading, setIsUploading] = useState(false);
  const [form, setForm] = useState({
    title: '',
    thumbnail: null,
    prompt: '',
    video: null,
  });

  const openPicker = async (selectType) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: selectType === 'image' ? ['image/*'] : ['video/mp4', 'video/gif'],
      });
      if (!result.canceled) {
        if (selectType === 'image') {
          setForm({ ...form, thumbnail: result.assets[0] });
        } else if (selectType === 'video') {
          setForm({ ...form, video: result.assets[0] });
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to open document picker');
    }
  };
  

  const submit = async () => {
    if (!form.prompt || !form.thumbnail || !form.title || !form.video) {
      Alert.alert("Please", "All fields are required");
      return;
    }
    setIsUploading(true);
    try {
      // const compressedVideoUri = await compressVideo(form.video.uri);
      // if (!compressedVideoUri) {
      //   throw new Error("Video compression failed");
      // }
      await createVideo({
        ...form,
        // video: { ...form.video, uri: compressedVideoUri },
        userId: user.$id,
      });
      ToastAndroid.show("Uploaded Successfully", ToastAndroid.LONG);
      router.push("/Home");
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Video Upload Error: ", error);
      Alert.alert("Error", "Failed to upload. Try again!");
    } finally {
      setForm({
        title: "",
        thumbnail: null,
        prompt: "",
        video: null,
      });
      setIsUploading(false);
    }
  };
  
  // const uploadToCloudinary = async (fileUri, type) => {
  //   if (!fileUri) {
  //     // console.error('No file URI provided');
  //     throw new Error('File URI is required');
  //   }
  
  //   // Ensure the URI starts with 'file://'
  //   const formattedFileUri = fileUri.startsWith('file://') ? fileUri : `file://${fileUri}`;
  //   // console.log('Formatted File URI:', formattedFileUri);
  
  //   const data = new FormData();
  //   data.append('file', {
  //     uri: formattedFileUri,
  //     type: type || 'application/octet-stream',
  //     name: formattedFileUri.split('/').pop() || 'unknown',
  //   });
  //   data.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
  
  //   try {
  //     const response = await fetch(CLOUDINARY_URL, {
  //       method: 'POST',
  //       body: data,
  //       headers: {
  //         'Content-Type': 'multipart/form-data',
  //       },
  //     });
  
  //     if (!response.ok) {
  //       const error = await response.text();
  //       // console.error('Cloudinary Upload Error Response: ', error);
  //       throw new Error('Failed to upload to Cloudinary');
  //     }
  
  //     const result = await response.json();
  //     return result.secure_url;
  //   } catch (error) {
  //     // console.error('Cloudinary Upload Error: ', error);
  //     throw new Error('Failed to upload to Cloudinary');
  //   }
  // };
  

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView className="px-4 my-6">
        <Text className="text-white mt-10 font-pbold text-2xl">Upload video</Text>
        <View>
          <Inputs
            label="Video Title"
            placeholder="Give your video a catchy title.."
            value={form.title}
            handleChangeText={(e) => setForm({ ...form, title: e })}
          />
          <Inputs
            label="AI Prompt"
            placeholder="AI prompt of your video"
            value={form.prompt}
            handleChangeText={(e) => setForm({ ...form, prompt: e })}
          />
          <View className="mt-7 space-y-2">
            <Text className="text-base text-gray-100 font-pmedium">Upload Video</Text>
            <TouchableOpacity onPress={() => openPicker('video')}>
              {form.video ? (
                <Video
                  source={{ uri: form.video.uri }}
                  className="w-full h-64 rounded-xl bg-gray-100"
                  resizeMode={ResizeMode.CONTAIN}
                />
              ) : (
                <View className="w-full h-40 bg-black-100 rounded-2xl justify-center items-center">
                  <View className="border border-secondary-100 items-center justify-center h-14 w-14 rounded-2xl">
                    <Image
                      source={icons.upload}
                      resizeMode="contain"
                      className="w-1/2 h-1/2"
                    />
                  </View>
                </View>
              )}
            </TouchableOpacity>
          </View>
          <View className="mt-7 space-y-6">
            <Text className="text-base text-gray-100 font-pmedium">Thumbnail Image</Text>
            <TouchableOpacity onPress={() => openPicker('image')}>
              {form.thumbnail ? (
                <Image
                  source={{ uri: form.thumbnail.uri }}
                  className="w-full h-64 rounded-xl bg-gray-100"
                  resizeMode="cover"
                />
              ) : (
                <View className="w-full h-20 bg-black-100 rounded-2xl justify-center items-center border-2 border-black-200 flex-row space-x-2">
                  <Image
                    source={icons.upload}
                    resizeMode="contain"
                    className="w-1/2 h-1/2"
                  />
                  <Text className="font-pmedium text-gray-100 text-sm">
                    Choose a file
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>
        <CustomButton
          handlePress={submit}
          containerStyles="mt-10 text-black"
          textStyles="text-black font-pbold"
          isLoading={isUploading}
          title={isUploading ? 'Uploading...' : 'Create & Publish'}
          disabled={isUploading}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Create;
