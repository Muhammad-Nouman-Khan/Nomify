import FriendRequest from "../models/friendrequest.model.js";
import User from "../models/user.model.js";

export async function getRecommendedUsers(req, res) {
  try {
    const currentUserId = req.user.id;
    const currentUser = req.user;

    const recommendedUsers = await User.find({
      $and: [
        { _id: { $ne: currentUserId } }, // exclude current user
        { _id: { $nin: currentUser.friends } }, // exclude current user's friends
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
    //recipient is the one who is receiving the friend request
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

export async function acceptFriendRequest(req, res) {
  try {
    // requestId is the id of the friend request that is being accepted
    // who will send that id in params ? : the recipient of the friend request

    const { id: requestId } = req.params;
    const friendRequest = await FriendRequest.findById(requestId);

    if (!friendRequest) {
      return res.status(404).json({ message: "Friend request not found" });
    }

    // verify the current user is the recipient of the friend request
    //why toString() ? : because the friendRequest.recipient is an object and we want to compare it with the req.user.id which is a string
    if (friendRequest.recipient.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "You are not authorized to accept this request" });
    }

    friendRequest.status = "accepted";

    await friendRequest.save();

    // add each user to the other's friends array
    await User.findByIdAndUpdate(friendRequest.sender, {
      $addToSet: { friends: friendRequest.recipient }, // $addToSet is used to add a value to an array only if it is not already present
    });

    await User.findByIdAndUpdate(friendRequest.recipient, {
      $addToSet: { friends: friendRequest.sender },
    });

    res.status(200).json({ message: "Friend request accepted" });
  } catch (error) {
    console.error("Error in acceptFriendRequest", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getFriendRequests(req, res) {
  try {
    const incomingRequests = await FriendRequest.find({
      recipient: req.user.id,
      status: "pending",
    }).populate("sender", "fullName profilePic currentField learningField");

    const acceptedRequests = await FriendRequest.find({
      sender: req.user.id,
      status: "accepted",
    }).populate("recipient", "fullName profilePic");

    res.status(200).json({ incomingRequests, acceptedRequests });
  } catch (error) {
    console.error("Error in getFriendRequests", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getOutgoingFriendRequests(req, res) {
  try {
    const ongoingRequests = await FriendRequest.find({
      sender: req.user.id,
      status: "pending",
    }).populate("recipient", "fullName profilePic currentField learningField");

    res.status(200).json(ongoingRequests);
  } catch (error) {
    console.error("Error in getOutgoingFriendRequests", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}
