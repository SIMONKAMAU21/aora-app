import { Client,Account ,ID} from 'react-native-appwrite';

export const config ={
    endpoint:"https://cloud.appwrite.io/v1",
    platform:"com.simon.aora",
    projectId:"66881f2f001ac18edbe3",
    databaseId:"668822ae00082eda68bf",
    userCollectionId:"66882370002b508a0fca",
    videoCollectionId:"668823bd000b260d1809",
    storageId:"6688271d00099530d98a",

}
// Init your React Native SDK
const client = new Client();
client
    .setEndpoint(config.endpoint) // Your Appwrite Endpoint
    .setProject(config.projectId) // Your project ID
    .setPlatform(config.platform) // Your application ID or bundle ID.
;

const account = new Account(client);
export const createUser=()=>{
    account.create(ID.unique(), 'me@example.com', 'password', 'Jane Doe')
    .then(function (response) {
        console.log(response);
    }, function (error) {
        console.log(error);
    });

}

