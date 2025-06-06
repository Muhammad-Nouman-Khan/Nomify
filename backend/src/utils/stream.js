import { StreamChat } from "stream-chat";
import dotenv from "dotenv";
dotenv.config();
const apiKey = process.env.STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET;

if (!apiKey || !apiSecret) {
  console.log("Stream api key or secret is missing");
}

//stream client is used to connect to the stream server
const streamClient = StreamChat.getInstance(apiKey, apiSecret);

const upsertStreamUser = async (userData) => {
  try {
    //upsertUsers is used to create a new user or update an existing user
    await streamClient.upsertUsers([userData]);
    return userData;
  } catch (error) {
    console.error("Error in upsertStreamUser", error);
  }
};

export default upsertStreamUser;

export const generateStreamToken = async (userId) => {
  try {
    //ensure user id is a string
    const userIdStr = userId.toString();
    return streamClient.createToken(userIdStr);
  } catch (error) {
    console.error("Error in generateStreamToken", error);
  }
};
