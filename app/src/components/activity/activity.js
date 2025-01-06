import React, { useEffect, useState } from 'react';
import { BsCircleFill, BsMoonFill, BsDashCircleFill, BsWifiOff } from 'react-icons/bs';
import activityStyles from './activity.module.css';

const fetchGuildStatistics = async () => {
  try {
    const response = await fetch('https://api.upayan.dev');
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Server responded with an error');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching guild statistics:', error);
    return null;
  }
};

const getStatusIcon = (status) => {
  const icons = {
    online: <BsCircleFill color="#22C55E" />,
    idle: <BsMoonFill color="#FACC15" />,
    dnd: <BsDashCircleFill color="#EF4444" />,
    default: <BsWifiOff color="#6B7280" />,
  };
  return icons[status.toLowerCase()] || icons.default;
};

const formatElapsedTime = (startTimestamp) => {
  const elapsedTime = Date.now() - new Date(startTimestamp).getTime();
  const days = Math.floor(elapsedTime / (1000 * 60 * 60 * 24));
  const hours = Math.floor((elapsedTime / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((elapsedTime / (1000 * 60)) % 60);

  return `${days ? `${days}d ` : ''}${hours ? `${hours}h ` : ''}${minutes ? `${minutes}m` : ''}`.trim();
};

const Activity = () => {
  const [guildStatistics, setGuildStatistics] = useState(null);
  const activityWhitelist = ['Spotify', 'Visual Studio Code'];

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchGuildStatistics();
      setGuildStatistics(data);
    };

    fetchData();

    const intervalId = setInterval(() => {
      fetchData();
    }, 15000);

    return () => clearInterval(intervalId);
  }, []);

  if (!guildStatistics || guildStatistics.length === 0) {
    return null;
  }

  return (
    <div className={activityStyles.activities}>
      {guildStatistics.map((guild, guildIndex) => (
        <div key={guildIndex}>
          <div className={activityStyles.status}>
            {getStatusIcon(guild.discordstatus)} <span>{guild.discordstatus}</span>
          </div>
          <ul>
            {guild.activities
              .filter(activity => activityWhitelist.includes(activity.name))
              .map((activity, activityIndex) => (
                <div key={activityIndex} className={activityStyles.activity}>
                  {activity.largeImageURL && (
                    <img
                      src={activity.largeImageURL}
                      alt={activity.largeText}
                    />
                  )}
                  <h3>{activity.name}</h3>
                  <p>{activity.details}</p>
                  <p>{activity.state}</p>
                  <p>
                    {formatElapsedTime(activity.startTimestamp)}
                  </p>
                </div>
              ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default Activity;