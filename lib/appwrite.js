import { Client, Account, ID, Avatars, Databases } from "react-native-appwrite";

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
        avartar: avatarUrl,
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
    // Attempt to create a new session directly
    const session = await account.createEmailPasswordSession(email, password);
    return session;
  } catch (error) {
    // Handle session creation error
    if (error.message.includes("Session already exists")) {
      // If session already exists, get the current session
      const currentSession = await account.getSession("current");
      return currentSession;
    }
    console.error("Error:", error);
    throw new Error(error.message || "Failed to sign in");
  }
};