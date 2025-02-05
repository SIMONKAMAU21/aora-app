import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ToastAndroid,
  Alert,
} from "react-native";
import { Video } from "expo-av";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import { icons } from "../constants";
import {
  deleteVideo,
  saveVideo,
  fetchLikedVideos,
  unsaveVideo,
  getCurrentUser,
  videoLikes,
} from "../lib/appwrite";
import { useVideo } from "../videoContext";
import useAppwrite from "../lib/useAppwrite";
import { router } from "expo-router";
import { Divider, Menu } from "react-native-paper";

const Videos = ({
  Video: { $id, title, thumbnail, video, creator },
  onDelete,
}) => {
  const { playVideo, addVideoRef, playingVideoId } = useVideo();
  const avatar = creator?.avatar || "default-avatar-url";
  const username = creator?.username || "Unknown";
  const [downloading, setDownloading] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false); // Menu state
  const videoRef = useRef(null);
  const [deleting, setDeleting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [localVideoUri, setLocalVideoUri] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const { data: likes } = useAppwrite(() => videoLikes($id));
  const isPlaying = playingVideoId === $id;

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
        const saved = likedVideos?.documents?.some((doc) => doc?.$id === $id);
        setIsSaved(saved);
      } catch (error) {
        Alert.alert("error", error.message);
        console.error("Error checking if video is saved:", error);
      }
    };

    const fetchCurrentUser = async () => {
      try {
        const user = await getCurrentUser();
        setCurrentUserId(user.$id);
      } catch (error) {
        console.error("Error fetching current user:", error);
      }
    };

    loadVideo();
    checkIfSaved();
    fetchCurrentUser();
  }, [$id, video]);

  useEffect(() => {
    if (videoRef.current) {
      addVideoRef($id, videoRef.current);
    }
  }, [videoRef]);

  const handlePlaybackStatusUpdate = (status) => {
    if (status.didJustFinish) {
      playVideo(null);
    }
  };

  const handlePlayPress = () => {
    playVideo($id);
    // setPlay(true);
  };

  const handleDelete = async () => {
    const videoDocumentId = $id;
    try {
      setDeleting(true);
      await deleteVideo(videoDocumentId);
      if (onDelete) {
        onDelete();
      }
      ToastAndroid.show("Video Deleted successfully", ToastAndroid.LONG);
      setMenuVisible(false);
      setDeleting(false);
    } catch (error) {
      Alert.alert("Error", error);
    } finally {
      setDeleting(false);
    }
  };

  const handleSave = async () => {
    const userID = creator?.accountid;
    const videoId = $id;
    const uploaderId = userID;

    try {
      setSaving(true);
      await saveVideo(videoId, uploaderId);
      setIsSaved(true);
      ToastAndroid.show("Video saved Successfully", ToastAndroid.LONG);
      setMenuVisible(false);
    } catch (error) {
      Alert.alert("Error", error);
      setSaving(false);
      setMenuVisible(false);
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
      ToastAndroid.show("Video unsaved Successfully", ToastAndroid.LONG);
      setMenuVisible(false);
    } catch (error) {
      Alert.alert("Error", error);
      setSaving(false);
      setMenuVisible(false);
    } finally {
      setSaving(false);
    }
  };

  const goProfile = () => {
    router.push("/Profile");
  };

const handleDownload=async()=>{
  try {
    setDownloading(true);
    const {status}= await MediaLibrary.requestPermissionsAsync();
    if(status!=="granted"){
      throw new Error("Permission Denied");
    }
    const localPath=`${FileSystem.documentDirectory}${title}.mp4`;
    const downloadResumable=FileSystem.createDownloadResumable(
      video,
      localPath
    )
    const {uri}=await downloadResumable.downloadAsync();
    ToastAndroid.show("Video downloaded successfully",ToastAndroid.LONG);
  } catch (error) {
    Alert.alert("Error",error.message);
  }finally{
    setDownloading(false);
  }
}

  return (
    <View style={styles.container}>
      {isPlaying ? (
        <Video
          ref={videoRef}
          source={{ uri: localVideoUri || video }}
          style={styles.video}
          resizeMode="contain"
          useNativeControls
          shouldPlay={isPlaying}
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
          <View style={styles.infoOverlay}>
            <Text style={styles.userId}>@user {creator?.accountid}</Text>
          </View>
        </TouchableOpacity>
      )}
      <View style={styles.header} className="mt-5">
        <View style={styles.avatarContainer}>
          <Image
            source={{ uri: avatar }}
            style={styles.avatar}
            resizeMode="cover"
          />
        </View>
        <View onPress={goProfile} style={styles.infoContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.username} numberOfLines={1}>
            {username} || {`👍: ${likes}`} {` 👎: ${"0"}`}
          </Text>
        </View>

        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <TouchableOpacity onPress={() => setMenuVisible(true)}>
              <Image
                source={icons.menu}
                style={styles.menuIcon}
                resizeMode="contain"
              />
            </TouchableOpacity>
          }
        >
          {currentUserId === creator?.$id && (
            <Menu.Item
              leadingIcon={"delete"}
              onPress={handleDelete}
              title={deleting ? "Deleting..." : "Delete"}
            />
          )}
          <Menu.Item
            leadingIcon="heart"
            onPress={isSaved ? handleUnsave : handleSave}
            title={saving ? "Processing..." : isSaved ? "Unsave" : "Save"}
          />
          <Menu.Item
            leadingIcon="download"
            onPress={handleDownload}
            title={downloading ? "Downloading..." : "Download"}
          />
          <Divider />
          <Menu.Item onPress={() => setMenuVisible(false)} title="Cancel" />
        </Menu>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    padding: 10,
    // borderBottomWidth:1,
    // borderColor:"#ff9d00",
    borderRadius: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 40,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "green",
    // borderColor: "#ccc",
  },
  avatar: {
    width: "100%",
    height: "100%",
  },
  infoContainer: {
    flex: 1,
    marginLeft: 4,
  },
  title: {
    color: "white",
    fontWeight: "bold",
  },
  username: {
    color: "gray",
  },
  menuIcon: {
    width: 20,
    height: 20,
  },
  video: {
    width: "100%",
    height: 250,
    borderRadius: 10,
    marginTop: 10,
    borderBottomWidth: 1,
    borderColor: "green",
  },
  thumbnailContainer: {
    width: "100%",
    height: 240,
    borderRadius: 10,
    marginTop: 10,
    borderBottomWidth: 1,
    borderColor: "#ff9d00",
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  thumbnail: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  playIcon: {
    width: 48,
    height: 48,
    position: "absolute",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  modalView: {
    width: 350,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
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
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
  },
  infoOverlay: {
    position: "absolute",
    bottom: 10,
    left: 10,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    padding: 5,
    borderRadius: 5,
  },
});

export default Videos;
