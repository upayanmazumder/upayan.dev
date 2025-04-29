import { FaSpotify } from "react-icons/fa";
import { BiLogoVisualStudio } from "react-icons/bi";
import activityStyles from "./Activity.module.css";
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
    if (name === "Spotify")
      return <FaSpotify className={activityStyles.activityIcon} />;
    if (name === "Visual Studio Code")
      return <BiLogoVisualStudio className={activityStyles.activityIcon} />;
    return null;
  };

  const getActivityStyle = (name: string) => {
    if (name === "Spotify") return activityStyles.spotifyBackground;
    if (name === "Visual Studio Code") return activityStyles.vscodeBackground;
    return activityStyles.defaultBackground;
  };

  return (
    <AnimatePresence>
      {activities.length > 0 && (
        <div className={activityStyles.activitiesBelow}>
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
                className={`${activityStyles.activityItem} ${bgClass}`}
                key={key}
              >
                <div className={activityStyles.activityTop}>
                  {icon}
                  <span className={activityStyles.activityDetails}>
                    {activity.details}
                  </span>
                </div>
                <span className={activityStyles.activityState}>
                  {cleanState}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </AnimatePresence>
  );
}
