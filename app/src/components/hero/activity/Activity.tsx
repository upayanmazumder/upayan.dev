import { FaSpotify } from "react-icons/fa";
import { BiLogoVisualStudio } from "react-icons/bi";
import activityStyles from "./Activity.module.css";
import API from "../../../utils/api";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
        <motion.div
          className={activityStyles.activitiesBelow}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          {activities.map((activity, index) => {
            const key = `${activity.name}-${activity.startTimestamp}-${index}`;
            const icon = getActivityIcon(activity.name);
            const bgClass = getActivityStyle(activity.name);
            const cleanState =
              activity.name === "Spotify"
                ? activity.state.replace(/;/g, ",")
                : activity.state;

            return (
              <motion.div
                className={`${activityStyles.activityItem} ${bgClass}`}
                key={key}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", damping: 12 }}
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
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
