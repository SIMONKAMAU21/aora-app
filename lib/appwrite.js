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
    console.log("error", error);
    throw new Error(error.message || "Failed to get file preview");
  }
};
export const uploadFile = async (file, type) => {
  if (!file) return;
  const { mimeType, ...rest } = file;
  const asset = { type: mimeType, ...rest };

  try {
    const uploadFile = await storage.createFile(
      config.storageId,
      ID.unique(),
      asset
    );

    const fileUrl = await getFilePreview(uploadFile.$id, type);

    return fileUrl;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const createVideo = async (form) => {
  try {
    const [thumbnailUrl, videoUrl] = await Promise.all([
      uploadFile(form.thumbnail, "image"),
      uploadFile(form.video, "video"),
    ]);
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
    console.log("error", error);
    throw new Error(error.message || "Failed to create video");
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