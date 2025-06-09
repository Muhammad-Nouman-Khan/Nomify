import { Link } from "react-router";
import {
  Code2Icon,
  GraduationCapIcon,
  MapPinIcon,
  MessageSquareIcon,
} from "lucide-react";

const FriendCard = ({ friend }) => {
  return (
    <div className="card bg-base-200 hover:shadow-lg transition-all duration-300">
      <div className="card-body p-5 space-y-4">
        <div className="flex items-center gap-3">
          <div className="avatar size-16 rounded-full">
            <img src={friend.profilePic} alt={friend.fullName} />
          </div>

          <div>
            <h3 className="font-semibold text-lg">{friend.fullName}</h3>
            {friend.location && (
              <div className="flex items-center text-xs opacity-70 mt-1">
                <MapPinIcon className="size-3 mr-1" />
                {friend.location}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="badge badge-secondary w-fit text-xs">
            <Code2Icon className="size-3 mr-1 text-primary-content" />
            <span className="truncate max-w-[200px]">
              Skilled In: {friend.currentField}
            </span>
          </div>
          <div className="badge badge-outline w-fit text-xs">
            <GraduationCapIcon className="size-3 mr-1 text-secondary" />
            <span className="truncate max-w-[200px]">
              Learning: {friend.learningField}
            </span>
          </div>
        </div>

        {friend.bio && <p className="text-sm opacity-70">{friend.bio}</p>}

        <Link
          to={`/chat/${friend._id}`}
          className="btn btn-primary w-full mt-2"
        >
          <MessageSquareIcon className="size-4 mr-2" />
          Message
        </Link>
      </div>
    </div>
  );
};

export default FriendCard;
