import { useState } from "react";
import useAuthUser from "../hooks/useAuthUser";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { completeOnboarding } from "../lib/api";
import {
  CameraIcon,
  LoaderIcon,
  MapPinIcon,
  ShipWheelIcon,
  ShuffleIcon,
} from "lucide-react";
import { SKILL_AREAS } from "../constants";

const Onboarding = () => {
  const { authUser } = useAuthUser();
  const queryClient = useQueryClient();
  const [formState, setFormState] = useState({
    fullName: authUser?.fullName || "",
    bio: authUser?.bio || "",
    currentField: authUser?.currentField || "",
    learningField: authUser?.learningField || "",
    location: authUser?.location || "",
    profilePic: authUser?.profilePic || "",
  });

  const { mutate: onboardingMutation, isPending } = useMutation({
    mutationFn: completeOnboarding,
    onSuccess: () => {
      toast.success("Onboarding completed successfully");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: (error) => {
      toast.error(error.response.data.message);
    },
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    onboardingMutation(formState);
  };

  const handleRandomAvatar = () => {
    const index = Math.floor(Math.random() * 100) + 1;
    const randomAvatar = `https://avatar.iran.liara.run/public/${index}.png`;
    setFormState({ ...formState, profilePic: randomAvatar });
    toast.success("Random avatar generated successfully!");
  };

  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center p-4 ">
      <div className="card bg-base-200 w-full max-w-3xl shadow-xl ">
        <div className="card-body p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6">
            Complete Your Profile
          </h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* PROFILE PIC CONTAINER */}
            <div className="flex flex-col items-center justify-center space-y-4">
              {/* IMAGE PREVIEW */}
              <div className="size-32 rounded-full bg-base-300 overflow-hidden">
                {formState.profilePic ? (
                  <img
                    src={formState.profilePic}
                    alt="Profile Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <CameraIcon className="size-12 text-base-content opacity-40" />
                  </div>
                )}
              </div>
              {/* Generate Random Avatar BTN */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleRandomAvatar}
                  className="btn btn-accent"
                >
                  <ShuffleIcon className="size-4 mr-2" />
                  Generate Random Avatar
                </button>
              </div>
            </div>
            {/* FULL NAME */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Full Name</span>
              </label>
              <input
                type="text"
                name="fullName"
                value={formState.fullName}
                onChange={(e) =>
                  setFormState({ ...formState, fullName: e.target.value })
                }
                className="input input-bordered w-full"
                placeholder="Your full name"
              />
            </div>
            {/* BIO */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Bio</span>
              </label>
              <textarea
                name="bio"
                value={formState.bio}
                onChange={(e) =>
                  setFormState({ ...formState, bio: e.target.value })
                }
                className="textarea textarea-bordered h-24"
                placeholder="Let others know what you do—and what you want to master next."
              />
            </div>
            {/* SKILLS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* CURRENT FIELD */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Your Current Skill Area</span>
                </label>
                <select
                  name="currentField"
                  value={formState.currentField}
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      currentField: e.target.value,
                    })
                  }
                  className="select select-bordered w-full"
                >
                  <option value="">Select your current skill</option>
                  {SKILL_AREAS.map((skill) => (
                    <option
                      key={`current-${skill}`}
                      value={skill.toLowerCase()}
                    >
                      {skill}
                    </option>
                  ))}
                </select>
              </div>
              {/* LEARNING FIELD */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Skill You Want to Learn</span>
                </label>
                <select
                  name="learningField"
                  value={formState.learningField}
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      learningField: e.target.value,
                    })
                  }
                  className="select select-bordered w-full"
                >
                  <option value="">Select the skill you want to learn</option>
                  {SKILL_AREAS.map((skill) => (
                    <option
                      key={`learning-${skill}`}
                      value={skill.toLowerCase()}
                    >
                      {skill}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {/* LOCATION */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Location</span>
              </label>
              <div className="relative">
                <MapPinIcon className="absolute top-1/2 transform -translate-y-1/2 left-3 size-5 text-base-content opacity-70" />
                <input
                  type="text"
                  name="location"
                  value={formState.location}
                  onChange={(e) =>
                    setFormState({ ...formState, location: e.target.value })
                  }
                  className="input input-bordered w-full pl-10"
                  placeholder="City, Country"
                />
              </div>
            </div>
            {/* SUBMIT BUTTON */}
            <button
              className="btn btn-primary w-full"
              disabled={isPending}
              type="submit"
            >
              {!isPending ? (
                <>
                  <ShipWheelIcon className="size-5 mr-2" />
                  Complete Onboarding
                </>
              ) : (
                <>
                  <LoaderIcon className="animate-spin size-5 mr-2" />
                  Onboarding...
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
