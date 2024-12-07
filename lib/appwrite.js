import {
  Client,
  Account,
  ID,
  Avatars,
  Databases,
  Query,
  Storage,
} from "react-native-appwrite";

export const config = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: "com.simon.aora",
  projectId: "66881f2f001ac18edbe3",
  databaseId: "668822ae00082eda68bf",
  userCollectionId: "66882370002b508a0fca",
  videoCollectionId: "668823bd000b260d1809",
  likesCollectionId: "66a747480014da4fc1da",
  imagesCollectionId:"66acb7bb00392c032b4a",
  storageId: "6688271d00099530d98a",
};

// Init your React Native SDK
const client = new Client();
client
  .setEndpoint(config.endpoint) // Your Appwrite Endpoint
  .setProject(config.projectId) // Your project ID
  .setPlatform(config.platform); // Your application ID or bundle ID.

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);
const storage = new Storage(client);

export const createUser = async (email, password, username) => {
  try {
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username
    );

    if (!newAccount) throw new Error("Failed to create account");

    const avatarUrl = avatars.getInitials(username);

    await signIn(email, password);

    const newUser = await databases.createDocument(
      config.databaseId,
      config.userCollectionId,
      ID.unique(),
      {
        accountid: newAccount.$id,
        email,
        username,
        avatar: avatarUrl,
      }
    );

    return newUser;
  } catch (error) {
    console.error("Error:", error);
    throw new Error(error.message || "Failed to create user");
  }
};

export const signIn = async (email, password) => {
  try {
    // First, check if there's an active session
    const currentSession = await account.getSession("current");
    if (currentSession) {
      return currentSession;
    }
  } catch (error) {
    // If there's no active session, it will throw an error
    // Proceed to create a new session
  }

  try {
    const session = await account.createEmailPasswordSession(email, password);
    return session;
  } catch (error) {
    console.error("Error:", error);
    throw new Error(error.message || "Failed to sign in");
  }
};

export const getCurrentUser = async () => {
  try {
    const currentAccount = await account.get();
    if (!currentAccount) throw error;
    const currentUser = await databases.listDocuments(
      config.databaseId,
      config.userCollectionId,
      [Query.equal("accountid", currentAccount.$id)]
    );
    if (!currentUser) throw error;
    return currentUser.documents[0];
  } catch (error) {
    throw error;
  }
};

export const getPosts = async () => {
  try {
    const posts = await databases.listDocuments(
      config.databaseId,
      config.videoCollectionId
    );
    return posts.documents;
  } catch (error) {
    throw new Error(error.message || "Failed to sign in");
  }
};
export const getLatestPosts = async () => {
  try {
    const posts = await databases.listDocuments(
      config.databaseId,
      config.videoCollectionId,
      [Query.orderAsc("$createdAt", Query.limit(3))]
    );
    return posts.documents;
  } catch (error) {
    throw new Error(error.message || "Failed to sign in");
  }
};
export const searchPosts = async (query) => {
  try {
    const posts = await databases.listDocuments(
      config.databaseId,
      config.videoCollectionId,
      [Query.search("title", query)]
    );
    return posts.documents;
  } catch (error) {
    console.log("error", error);
    throw new Error(error.message || "Failed to sign in");
  }
};
export const getUserposts = async (userId) => {
  try {
    const posts = await databases.listDocuments(
      config.databaseId,
      config.videoCollectionId,
      [Query.equal("creator", userId)]
    )
    return posts.documents;
  } catch (error) {
    throw new Error(error.message || "Failed to sign in");
  }
};

export const signOut = async () => {
  try {
    const session = await account.deleteSession("current");

    return session;
  } catch (error) {
    throw new Error(error.message || "Failed to sign in");
  }
};
const getFilePreview = async (fileId, fileType) => {
  try {
    if (fileType === "image") {
      return storage.getFilePreview(config.storageId, fileId);
    }
    return storage.getFileView(config.storageId, fileId);
  } catch (error) {
    throw new Error(error.message || "Failed to get file preview");
  }
};

// export const uploadFile = async (file, type) => {
//   if (!file) return;
//   const { mimeType, ...rest } = file;
//   const asset = { type: mimeType, ...rest };

//   try {
//     // Create file on Appwrite storage
//     const uploadFile = await storage.createFile(
//       config.storageId,
//       ID.unique(),
//       asset
//     );

//     // Ensure uploadFile contains $id
//     if (!uploadFile || !uploadFile.$id) {
//       throw new Error('Failed to upload file. No file ID returned.');
//     }

//     // Get the file URL from the server
//     const fileUrl = await getFilePreview(uploadFile.$id, type);
    
//     if (!fileUrl) {
//       throw new Error('Failed to get file preview URL.');
//     }

//     return fileUrl;
//   } catch (error) {
//     console.error('Upload Error:', error);
//     throw new Error(error.message);
//   }
// };


// export const createVideo = async (form) => {
//   try {
//     const [thumbnailUrl, videoUrl] = await Promise.all([
//       uploadFile(form.thumbnail, "image"),
//       uploadFile(form.video, "video"),
//     ]);
//     const newPost = await databases.createDocument(
//       config.databaseId,
//       config.videoCollectionId,
//       ID.unique(),
//       {
//         thumbnail: thumbnailUrl,
//         title: form.title,
//         video: videoUrl,
//         prompt: form.prompt,
//         creator: form.userId,
//       }
//     );
//     return newPost;
//   } catch (error) {
//     console.log("error", error);
//     throw new Error(error.message || "Failed to create video");
//   }
// };
export const createVideo = async (form) => {
  try {
    // Upload video and thumbnail to Cloudinary
    const [thumbnailUrl, videoUrl] = await Promise.all([
      uploadToCloudinary(form.thumbnail.uri, "image"),
      uploadToCloudinary(form.video.uri, "video"),
    ]);

    // Save video details in the database
    const newPost = await databases.createDocument(
      config.databaseId,
      config.videoCollectionId,
      ID.unique(),
      {
        thumbnail: thumbnailUrl,
        title: form.title,
        video: videoUrl,
        prompt: form.prompt,
        creator: form.userId,
      }
    );
    return newPost;
  } catch (error) {
    console.error("Error creating video:", error);
    throw new Error(error.message || "Failed to create video");
  }
};

// Function to upload a file to Cloudinary
export const uploadToCloudinary = async (fileUri, fileType) => {
  const data = new FormData();
  data.append("file", {
    uri: fileUri,
    type: fileType === "image" ? "image/*" : "video/mp4",
    name: fileUri.split("/").pop(),
  });
  data.append("upload_preset", "wdfjbcug"); // Replace with your upload preset
  data.append("cloud_name", "diyuy63ue"); // Replace with your cloud name

  const url = `https://api.cloudinary.com/v1_1/diyuy63ue/${fileType}/upload`;

  try {
    const response = await fetch(url, {
      method: "POST",
      body: data,
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error.message || "Cloudinary upload failed");
    }

    return result.secure_url; // Return the uploaded file URL
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw error;
  }
};



export const deleteVideo = async (videoDocumentId) => {
  try {
    // Fetch the current user's info
    const currentUser = await account.get();
    const userId = currentUser.$id;

    // Fetch the video document to verify its existence and ownership
    const existingVideo = await databases.getDocument(
      config.databaseId,
      config.videoCollectionId,
      videoDocumentId
    );
    console.log('existingVideo', existingVideo);

    // Check if the current user is the creator of the video

    const creatorId = existingVideo.creator.accountid;
    if (creatorId !== userId) {
      throw new Error("Unauthorized to delete this video");
    }

    // Proceed to delete the video document
    const deletedVideo = await databases.deleteDocument(
      config.databaseId,
      config.videoCollectionId,
      videoDocumentId
    );

    return deletedVideo;
  } catch (error) {
    console.error('Error deleting video:', error);
    throw new Error(error.message || "Failed to delete video");
  }
};

export const saveVideo = async (documentId,uploaderId) => {
  try {
    const currentUser = await account.get();
    console.log('currentUser', currentUser)
    const userId = currentUser.$id;

    // Check if the video is already liked by the user
    const existingLikes = await databases.listDocuments(
      config.databaseId,
      config.likesCollectionId,
      [
        Query.equal('userId', userId),
        Query.equal('videoId', documentId),
        Query.equal('creator', uploaderId),

      ]
    );

    if (existingLikes.documents.length > 0) {
      return { alreadySaved: true, message: "Video already saved" };
    }

    // If not already liked, create a new like document
    const video = await databases.createDocument(
      config.databaseId,
      config.likesCollectionId,
      ID.unique(),
      {
        userId: userId,
        videoId: documentId,
        creator:uploaderId,
      }
    );
    return { video };
  } catch (error) {
    throw new Error(error.message || "Failed to save video");
  }
};
export const unsaveVideo = async (documentId) => {
  try {
    const currentUser = await account.get();
    const userId = currentUser.$id;
    // Query to find the document based on userId and videoId
    const existingLike = await databases.listDocuments(
      config.databaseId,
      config.likesCollectionId,
      [
        Query.equal('userId', userId),
        Query.equal('videoId', documentId)
      ]
    );

    if (existingLike.documents.length === 0) {
      return { alreadyUnsaved: true, message: "Video not saved by the user" };
    }
    // Use the ID from the query result to delete the document
    const likeDocumentId = existingLike.documents[0].$id;

    const deleted = await databases.deleteDocument(
      config.databaseId,
      config.likesCollectionId,
      likeDocumentId
    );

    return deleted;
  } catch (error) {
    throw new Error(error.message || "Failed to unsave video");
  }
};

export const fetchLikedVideos = async () => {
  try {
    const currentUser = await account.get();
    const userId = currentUser.$id;
   
    const likedDocument = await databases.listDocuments(
      config.databaseId,
      config.likesCollectionId,
      [Query.equal("userId", userId)]
    );
    const likedVideosIds = likedDocument.documents.map((doc) => doc.videoId);
    if (likedVideosIds.length === 0) {
      return [];
    }
    const likedVideos = await databases.listDocuments(
      config.databaseId,
      config.videoCollectionId,
      [Query.equal("$id", likedVideosIds)]
    );
    return likedVideos;
  } catch (error) {
    throw new Error(error.message);
  }
};
export const userLikes = async (creatorId) => {
  const creator = creatorId
  console.log('creator', creator)
  try {
    const likeResponse = await databases.listDocuments(
      config.databaseId,
      config.likesCollectionId,
      [Query.equal("creator", creatorId)]
    );
    const uniqueUserIds = [...new Set(likeResponse.documents.map(doc => doc.userId))];
    return uniqueUserIds.length;
  } catch (error) {
    throw new Error(error.message || "Failed to fetch likes");
  }
};

export const videoLikes = async (videoId) =>{
  try {
    const eachVideoLike = await databases.listDocuments(
      config.databaseId,
      config.likesCollectionId,
      [Query.equal("videoId",videoId)]
    );
    const uniqueUserIds = [...new Set(eachVideoLike.documents.map(doc => doc.userId))];
    return uniqueUserIds.length;

  } catch (error) {
    throw new Error(error.message || "Failed to fetch likes");

  }
}

// export const uploadProfileImage = async (file) => {
//   if (!file || !file.uri) {
//     throw new Error('File object or URI is missing');
//   }

//   const { uri, mimeType = 'image/jpeg' } = file;

//   try {
//     // Convert the URI to a blob
//     const response = await fetch(uri);
//     const blob = await response.blob();

//     // Create a FormData object to hold the file
//     const formData = new FormData();
//     formData.append('file', {
//       uri: uri,
//       type: mimeType,
//       name: file.fileName || 'profile-image.jpg', // Use the file name from the ImagePicker result
//     });

//     // Upload the file to Appwrite
//     const uploadResponse = await storage.createFile(
//       config.storageId,
//       ID.unique(),
//       blob
//     );

//     if (!uploadResponse || !uploadResponse.$id) {
//       throw new Error('Failed to upload profile image. No file ID returned.');
//     }

//     // Generate a URL to access the uploaded file
//     const fileUrl = await getFilePreview(uploadResponse.$id, 'image');

//     if (!fileUrl) {
//       throw new Error('Failed to get file preview URL.');
//     }

//     return fileUrl;
//   } catch (error) {
//     console.error('Profile Image Upload Error:', error);
//     throw new Error(error.message);
//   }
// };

export const updateUserProfile = async (userId, avatarUrl) => {
  try {
    const updatedUser = await databases.updateDocument(
      config.databaseId,
      config.userCollectionId,
      userId,
      { avatar: avatarUrl }
    );

    return {
      success: true,
      message: 'Profile updated successfully!',
      user: updatedUser,
    };
  } catch (error) {
    console.error('Update Error:', error);
    throw new Error(error.message || 'Failed to update profile');
  }
};

