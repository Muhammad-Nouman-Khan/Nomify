import FriendRequest from "../models/friendrequest.model.js";
import User from "../models/user.model.js";

export async function getRecommendedUsers(req, res) {
  try {
    const currentUserId = req.user.id;
    const currentUser = req.user;

    const recommendedUsers = await User.find({
      $and: [
        { _id: { $ne: currentUserId } }, // exclude current user
        { $id: { $nin: currentUser.friends } }, // exclude current user's friends
        { isOnboarded: true },
      ],
    });
    res.status(200).json(recommendedUsers);
  } catch (error) {
    console.error("Error in getRecommendedUsers", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getMyFriends(req, res) {
  try {
    //if we only write select("friends") then it will return the friends array containing the user ids but we want other user details too
    const user = await User.findById(req.user.id)
      .select("friends")
      .populate("friends", "fullName profilePic currentField learningField"); //populate takes 2 arguments, first is the field to populate, second is the fields to select
    res.status(200).json(user.friends);
  } catch (error) {
    console.error("Error in getMyFriends", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function sendFriendRequest(req, res) {
  try {
    const myId = req.user.id;
    const { id: recipientId } = req.params;

    //prevent sending friend request to yourself
    if (myId === recipientId) {
      return res
        .status(400)
        .json({ message: "You cannot send friend request to yourself" });
    }
    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({ message: "Recipient not found" });
    }
    //check if already friends
    if (recipient.friends.includes(myId)) {
      return res
        .status(400)
        .json({ message: "You are already friends with this user" });
    }

    //check if already sent friend request
    const existingRequest = await FriendRequest.findOne({
      $or: [
        { sender: myId, recipient: recipientId },
        { sender: recipientId, recipient: myId },
      ],
    });
    if (existingRequest) {
      return res.status(400).json({
        message: "A Friend request already exists between you and this user",
      });
    }

    const friendRequest = await FriendRequest.create({
      sender: myId,
      recipient: recipientId,
    });

    res.status(201).json(friendRequest);
  } catch (error) {
    console.error("Error in sendFriendRequest", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}
