import { Client, Account, ID, Avatars, Databases, Query } from "react-native-appwrite";

export const config = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: "com.simon.aora",
  projectId: "66881f2f001ac18edbe3",
  databaseId: "668822ae00082eda68bf",
  userCollectionId: "66882370002b508a0fca",
  videoCollectionId: "668823bd000b260d1809",
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
    const session = await account.createEmailPasswordSession(email, password);
    return session;
  } catch (error) {
    if (error.message.includes("Session already exists")) {
      const currentSession = await account.getSession("current");
      return currentSession;
    }
    console.error("Error:", error);
    throw new Error(error.message || "Failed to sign in");
  }
};

export const getCurrentUser = async () => {
  try {
    const currentAccount = await account.get();
    console.log('Current Account:', currentAccount); // Log the current account for debugging

    if (!currentAccount) {
      throw new Error("Current account not found");
    }

    const currentUser = await databases.listDocuments(
      config.databaseId,
      config.userCollectionId,
      [Query.equal('accountid', currentAccount.$id)]
    );

    console.log('Current User Query Result:', currentUser); // Log the query result for debugging

    if (!currentUser.documents.length) {
      throw new Error("Current user not found");
    }

    return currentUser.documents[0];
  } catch (error) {
    console.error("Error:", error);
    throw new Error(error.message || "Failed to get current user");
  }
};


export const getAllUsers = async () =>{
  try {
    const allUsers = await databases.listDocuments(
      config.databaseId,
      config.userCollectionId,
    )
    console.log('allUsers', allUsers)
  } catch (error) {
    console.log('error', error)
  }
}