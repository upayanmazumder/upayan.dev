/* eslint-disable @next/next/no-img-element */
'use client'

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import activityStyles from "./activity.module.css";

interface Activity {
    name: string;
    type: number;
    details: string;
    state: string;
    startTimestamp: string;
    endTimestamp: string | null;
    largeImageURL: string;
    largeText: string;
    smallImageURL: string | null;
    smallText: string | null;
}

interface GuildActivity {
    discordstatus: string;
    activities: Activity[];
}

const ActivityComponent: React.FC = () => {
    const [activities, setActivities] = useState<GuildActivity[]>([]);
    const [elapsedTimes, setElapsedTimes] = useState<{ [key: string]: number }>({});

    useEffect(() => {
        const fetchActivities = async () => {
            try {
                const response = await axios.get('https://api.upayan.dev/');
                setActivities(response.data);
            } catch (error) {
                console.error('Error fetching activities:', error);
            }
        };

        fetchActivities();
        const interval = setInterval(fetchActivities, 5000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setElapsedTimes((prevElapsedTimes) => {
                const newElapsedTimes = { ...prevElapsedTimes };
                activities.forEach((guildActivity) => {
                    guildActivity.activities.forEach((activity) => {
                        const startTime = new Date(activity.startTimestamp).getTime();
                        const currentTime = Date.now();
                        newElapsedTimes[activity.name] = Math.floor((currentTime - startTime) / 1000);
                    });
                });
                return newElapsedTimes;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [activities]);

    const formatElapsedTime = (seconds: number) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        const formattedTime = [];
        if (hrs > 0) formattedTime.push(`${hrs}h`);
        if (mins > 0) formattedTime.push(`${mins}m`);
        if (secs > 0) formattedTime.push(`${secs}s`);
        return formattedTime.join(' ');
    };

    const calculateProgress = (startTimestamp: string, endTimestamp: string | null) => {
        const start = new Date(startTimestamp).getTime();
        const end = endTimestamp ? new Date(endTimestamp).getTime() : null;
        const now = Date.now();

        if (!end) return 0; // If there's no end time, return 0 progress

        const total = end - start;
        const elapsed = now - start;
        return Math.min(100, Math.max(0, (elapsed / total) * 100));
    };

    return (
        <div className={activityStyles.wrapper}>
            {activities.map((guildActivity, guildIndex) => (
                <div key={guildIndex} className={activityStyles.activities}>
                    <p className={activityStyles.status}>{guildActivity.discordstatus}</p>
                    {guildActivity.activities.map((activity, activityIndex) => (
                        <div key={activityIndex} className={activityStyles.activity}>
                            <h3>{activity.name}</h3>
                            <p>{activity.details}</p>
                            <p>{activity.state}</p>
                            <p>{formatElapsedTime(elapsedTimes[activity.name] || 0)}</p>
                            {activity.endTimestamp && (
                                <div className={activityStyles.progressBar}>
                                    <div 
                                        className={activityStyles.progressFill}
                                        style={{width: `${calculateProgress(activity.startTimestamp, activity.endTimestamp)}%`}}
                                    ></div>
                                </div>
                            )}
                            {activity.largeImageURL && <img src={activity.largeImageURL} alt={activity.largeText} title={activity.largeText} />}
                            {activity.smallImageURL && <img src={activity.smallImageURL} alt={activity.smallText || undefined} title={activity.smallText || undefined} />}
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default ActivityComponent;
