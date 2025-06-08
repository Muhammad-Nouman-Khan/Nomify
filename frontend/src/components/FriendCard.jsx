import { Link } from "react-router";
import { Code2Icon, GraduationCapIcon } from "lucide-react";

const FriendCard = ({ friend }) => {
  return (
    <div className="card bg-base-200 hover:shadow-md transition-shadow">
      <div className="card-body p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="avatar size-12">
            <img src={friend.profilePic} alt={friend.fullName} />
          </div>
          <h3 className="font-semibold truncate">{friend.fullName}</h3>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-3">
          <span className="badge badge-secondary text-xs">
            <Code2Icon className="size-3 mr-1 text-primary-content" />
            Skilled In: {friend.currentField}
          </span>
          <span className="badge badge-outline text-xs">
            <GraduationCapIcon className="size-3 mr-1 text-primary-content" />
            Learning: {friend.learningField}
          </span>
        </div>

        <Link to={`/chat/${friend._id}`} className="btn btn-outline w-full">
          Message
        </Link>
      </div>
    </div>
  );
};

export default FriendCard;
