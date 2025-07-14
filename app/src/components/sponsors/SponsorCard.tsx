import React from "react";
import Card from "../ui/card/Card";

interface SponsorCardProps {
  imgSrc: string;
  alt: string;
  name: string;
  handle: string;
}

const SponsorCard: React.FC<SponsorCardProps> = ({
  imgSrc,
  alt,
  name,
  handle,
}) => (
  <Card
    content={
      <>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: "16px",
            }}
          >
            <img
              src={imgSrc}
              alt={alt}
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "50%",
                objectFit: "cover",
                border: "2px solid #849ab2",
              }}
            />
            <div>
              <div
                style={{ fontWeight: 600, fontSize: "1.2rem", color: "#fff" }}
              >
                {name}
              </div>
              <div style={{ color: "#abb7c4", fontSize: "1rem" }}>{handle}</div>
            </div>
          </div>
          <div
            style={{
              color: "#849ab2",
              fontSize: "0.95rem",
              marginLeft: "16px",
              whiteSpace: "nowrap",
            }}
          >
            &quot;i love vibecoders&quot;
          </div>
        </div>
      </>
    }
  />
);

export default SponsorCard;
