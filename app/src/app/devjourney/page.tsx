import React from "react";
import DevJourney from "../../components/devjourney/devjourney";

const DevJourneyPage = () => {
  return (
    <main>
      <div className="page-header">
        <h1>DevJourney</h1>
        <p>My development journey</p>
      </div>
      <DevJourney />
    </main>
  );
};

export default DevJourneyPage;

export const metadata = {
  title: "Upayan - Devjourney",
  description: "View my coding journey",
};
