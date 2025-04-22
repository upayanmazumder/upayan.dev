/* eslint-disable @next/next/no-img-element */
"use client";

import styles from "./branding.module.css";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaSpotify } from "react-icons/fa";
import { BiLogoVisualStudio } from "react-icons/bi";
import API from "../../../utils/api";

interface Activity {
  name: string;
  details: string;
  state: string;
  startTimestamp: string;
  largeImageURL?: string;
}

export default function Branding() {
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await axios.get(`${API}/`);
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
      } catch (err) {
        console.error("Error fetching activity:", err);
      }
    };

    fetchActivities();
    const interval = setInterval(fetchActivities, 1000);
    return () => clearInterval(interval);
  }, []);

  const getActivityIcon = (name: string) => {
    if (name === "Spotify")
      return <FaSpotify className={styles.activityIcon} />;
    if (name === "Visual Studio Code")
      return <BiLogoVisualStudio className={styles.activityIcon} />;
    return null;
  };

  const getActivityStyle = (name: string) => {
    if (name === "Spotify") return styles.spotifyBackground;
    if (name === "Visual Studio Code") return styles.vscodeBackground;
    return styles.defaultBackground;
  };

  return (
    <div className={styles.wrapper}>
      <img
        src="/upayan-transparent-cropped.avif"
        alt="Upayan's Profile Picture"
        width={200}
        height={100}
        className={styles.upayanIcon}
      />
      {activities.length > 0 && (
        <div className={styles.activitiesBelow}>
          {activities.map((activity, index) => {
            const key = `${activity.name}-${activity.startTimestamp}-${index}`;
            const icon = getActivityIcon(activity.name);
            const bgClass = getActivityStyle(activity.name);
            const cleanState =
              activity.name === "Spotify"
                ? activity.state.replace(/;/g, ",")
                : activity.state;

            return (
              <div className={`${styles.activityItem} ${bgClass}`} key={key}>
                <div className={styles.activityTop}>
                  {icon}
                  <span className={styles.activityDetails}>
                    {activity.details}
                  </span>
                </div>
                <span className={styles.activityState}>{cleanState}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
