import React, { useState, useRef } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Modal, Button } from 'react-native';
import { Video } from 'expo-av';
import { icons } from '../constants';
import { deleteVideo } from '../lib/appwrite'; // Assuming deleteVideo is implemented

const Videos = ({ Video: { $id, title, thumbnail, video, creator }, onDelete }) => {
  const avatar = creator?.avatar || 'default-avatar-url';
  const username = creator?.username || 'Unknown';
  const [play, setPlay] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const videoRef = useRef(null);

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
    const videoId = $id
    try {
      await deleteVideo(videoId);
      // Optionally, refresh the video list or handle the deleted state
      if(onDelete){
        onDelete()
      }
      setModalVisible(false);
    } catch (error) {
      console.error("Error deleting video:", error);
    }
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
          source={{ uri: video }}
          style={styles.video}
          resizeMode="contain"
          useNativeControls
          shouldPlay
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
            <Button title="Delete" onPress={handleDelete} />
            <Button title="Save" onPress={() => { /* Implement save functionality */ }} />
            <Button title="Cancel" onPress={() => setModalVisible(false)} />
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
    marginLeft: 10,
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: 300,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
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
