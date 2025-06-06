import { generateStreamToken } from "../utils/stream.js";

// stream token is used to authenticate the user in the stream chat
// without it, the user will not be able to access the chat, or call
export async function getStreamToken(req, res) {
  try {
    const token = generateStreamToken(req.user.id);
    res.status(200).json({ token });
  } catch (error) {
    console.error("Error in getStreamToken", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}
