import React, { createContext, useContext, useState } from 'react';

const VideoContext = createContext();

export const VideoProvider = ({ children }) => {
  const [playingVideoId, setPlayingVideoId] = useState(null);
  const [videoRefs, setVideoRefs] = useState({});

  const addVideoRef = (id, ref) => {
    setVideoRefs((prevRefs) => ({ ...prevRefs, [id]: ref }));
  };

  const playVideo = (id) => {
    if (playingVideoId && videoRefs[playingVideoId]) {
      videoRefs[playingVideoId].pauseAsync();
    }
    setPlayingVideoId(id);
  };

  return (
    <VideoContext.Provider value={{ playVideo, addVideoRef,playingVideoId }}>
      {children}
    </VideoContext.Provider>
  );
};

export const useVideo = () => useContext(VideoContext);
