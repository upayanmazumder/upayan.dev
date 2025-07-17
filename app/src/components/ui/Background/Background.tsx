/* eslint-disable @next/next/no-img-element */
export default function Background() {
  return (
    <img
      src="/Wall.svg"
      alt="Background"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        objectFit: "fill",
        display: "block",
        zIndex: -1,
        pointerEvents: "none",
        userSelect: "none",
      }}
      draggable={false}
    />
  );
}
