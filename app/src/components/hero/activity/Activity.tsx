import { FaSpotify } from "react-icons/fa";
import { BiLogoVisualStudio } from "react-icons/bi";
import API from "../../../utils/api";
import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import axios from "axios";

interface Activity {
  name: string;
  details: string;
  state: string;
  startTimestamp: string;
  largeImageURL?: string;
}

export default function Activity() {
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await axios.get(`${API}/activity`);
        const activeList: Activity[] = response.data[0]?.activities || [];
        setActivities(
          activeList.map((a) => ({
            name: a.name,
            details: a.details || "",
            state: a.state || "",
            startTimestamp: a.startTimestamp || new Date().toISOString(),
            largeImageURL: a.largeImageURL,
          }))
        );
      } catch {}
    };

    fetchActivities();
    const interval = setInterval(fetchActivities, 3000);
    return () => clearInterval(interval);
  }, []);

  const getActivityIcon = (name: string) => {
    if (name === "Spotify") return <FaSpotify className="flex-shrink-0" />;
    if (name === "Visual Studio Code")
      return <BiLogoVisualStudio className="flex-shrink-0" />;
    return null;
  };

  const getActivityStyle = (name: string) => {
    if (name === "Spotify")
      return "bg-gradient-to-br from-[#1db954] to-[#1ed760] text-black";
    if (name === "Visual Studio Code")
      return "bg-gradient-to-br from-[#007acc] to-[#005a9e] text-white";
    return "bg-white/5 text-white";
  };

  return (
    <AnimatePresence>
      {activities.length > 0 && (
        <div className="flex flex-col gap-3 p-4 rounded-2xl backdrop-blur-md w-fit max-w-[300px] text-white mt-6 font-redhat">
          {activities.map((activity, index) => {
            const key = `${activity.name}-${activity.startTimestamp}-${index}`;
            const icon = getActivityIcon(activity.name);
            const bgClass = getActivityStyle(activity.name);
            const cleanState =
              activity.name === "Spotify"
                ? activity.state.replace(/;/g, ",")
                : activity.state;

            return (
              <div
                className={`flex flex-col gap-2 p-3 rounded-lg shadow-md transition-colors text-xs ${bgClass}`}
                key={key}
              >
                <div className="flex items-center gap-2">
                  {icon}
                  <span className="font-semibold opacity-95">
                    {activity.details}
                  </span>
                </div>
                <span className="opacity-85">{cleanState}</span>
              </div>
            );
          })}
        </div>
      )}
    </AnimatePresence>
  );
}
