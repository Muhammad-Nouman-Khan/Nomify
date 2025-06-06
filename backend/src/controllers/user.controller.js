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
