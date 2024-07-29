import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Modal, ToastAndroid, Alert } from 'react-native';
import { Video } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import { icons } from '../constants';
import { deleteVideo, saveVideo, fetchLikedVideos, unsaveVideo, getCurrentUser } from '../lib/appwrite'; 
import CustomButton from './CustomButton';

const Videos = ({ Video: { $id, title, thumbnail, video, creator }, onDelete, Delete}) => {
  const avatar = creator?.avatar || 'default-avatar-url';
  const username = creator?.username || 'Unknown';
  const [play, setPlay] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const videoRef = useRef(null);
  const [deleting, setDeleting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [localVideoUri, setLocalVideoUri] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);




  useEffect(() => {
    const loadVideo = async () => {
      const videoUri = `${FileSystem.documentDirectory}${$id}.mp4`;
      const fileInfo = await FileSystem.getInfoAsync(videoUri);

      if (fileInfo.exists) {
        setLocalVideoUri(videoUri);
      } else {
        await FileSystem.downloadAsync(video, videoUri);
        setLocalVideoUri(videoUri);
      }
    };

    const checkIfSaved = async () => {
      try {
        const likedVideos = await fetchLikedVideos();
        const saved = likedVideos.documents.some((doc) => doc.$id === $id);
        setIsSaved(saved);
      } catch (error) {
        console.error("Error checking if video is saved:", error);
      }
    };

  


    const fetchCurrentUser = async () =>{
      try {
        const user = await getCurrentUser()
        setCurrentUserId(user.$id)
      } catch (error) {
        console.error("Error fetching current user:", error);
  
      }
    }
    loadVideo();
    checkIfSaved();
    fetchCurrentUser()
  }, [$id, video]);

  const handlePlaybackStatusUpdate = (status) => {
    if (status.didJustFinish) {
      setPlay(false);
    }
  };

  const handlePlayPress = () => {
    setPlay(true);
  };

  const handleMenuPress = () => {
    setModalVisible(true);
  };

  const handleDelete = async () => {
    const videoDocumentId = $id; 
    try {
      setDeleting(true);
      await deleteVideo(videoDocumentId);
      if (onDelete) {
        onDelete();
      }
      ToastAndroid.show("Video Deleted successfully",ToastAndroid.LONG)
      setModalVisible(false);
      setDeleting(false);
    } catch (error) {
      Alert.alert("Error",error)

    }finally{
      setDeleting(false)
    }
  };

  const handleSave = async () => {
    const videoId = $id;
    try {
      setSaving(true);
      await saveVideo(videoId);
      setIsSaved(true);
      ToastAndroid.show("Video saved Successfully",ToastAndroid.LONG)
      setModalVisible(false);
    } catch (error) {
      Alert.alert("Error",error)
      setSaving(false);
      setModalVisible(false);
    } finally {
      setSaving(false);
    }
  };

  const handleUnsave = async () => {
    const videoId = $id;
    try {
      setSaving(true);
      await unsaveVideo(videoId);
      setIsSaved(false);
      ToastAndroid.show("Video unsaved Successfully",ToastAndroid.LONG)
      setModalVisible(false);
    } catch (error) {
      Alert.alert("Error",error)
      setSaving(false);
      setModalVisible(false);
    } finally {
      setSaving(false);
    }
  };

  const cancel = () => {
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Image
            source={{ uri: avatar }}
            style={styles.avatar}
            resizeMode="cover"
          />
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.username} numberOfLines={1}>
            {username}
          </Text>
        </View>
        <TouchableOpacity onPress={handleMenuPress}>
          <Image
            source={icons.menu}
            style={styles.menuIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
      {play ? (
        <Video
          ref={videoRef}
          source={{ uri: localVideoUri || video }}
          style={styles.video}
          resizeMode="contain"
          useNativeControls
          shouldPlay
          isLooping
          onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
          onError={(error) => console.log("Video Error:", error)}
        />
      ) : (
        <TouchableOpacity
          style={styles.thumbnailContainer}
          onPress={handlePlayPress}
        >
          <Image
            source={{ uri: thumbnail }}
            style={styles.thumbnail}
            resizeMode="cover"
          />
          <Image
            source={icons.play}
            style={styles.playIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
      )}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Options</Text>
            {currentUserId === creator.$id && ( <CustomButton
              title={deleting ? "Deleting..." : 'Delete'}
              handlePress={handleDelete}
              containerStyles='mt-1'
              isLoading={deleting}
              disabled={deleting}
              textStyles='font-pbold'
            />)}
           
            {isSaved ? (
              <CustomButton
                title={saving ? "Unsaving..." : "Remove from saved  videos"}
                handlePress={handleUnsave}
                containerStyles='mt-1'
                textStyles='font-pbold'
                isLoading={saving}
                disabled={saving}
              />
            ) : (
              <CustomButton
                title={saving ? "Saving..." : "Save"}
                handlePress={handleSave}
                containerStyles='mt-1'
                textStyles='font-pbold'
                isLoading={saving}
                disabled={saving}
              />
            )}
            <CustomButton
              title="Cancel"
              handlePress={cancel}
              containerStyles='mt-1'
              textStyles='font-pbold'
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    padding: 10
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 40,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  infoContainer: {
    flex: 1,
    marginLeft: 4,
  },
  title: {
    color: 'white',
    fontWeight: 'bold',
  },
  username: {
    color: 'white',
  },
  menuIcon: {
    width: 20,
    height: 20,
  },
  video: {
    width: '100%',
    height: 240,
    borderRadius: 10,
    marginTop: 10,
  },
  thumbnailContainer: {
    width: '100%',
    height: 240,
    borderRadius: 10,
    marginTop: 10,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  playIcon: {
    width: 48,
    height: 48,
    position: 'absolute',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalView: {
    width: 350,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Videos;
