export default function OfflinePage() {
  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <h1>You are offline 😓</h1>
      <p>This page is being served from the service worker cache.</p>
    </div>
  );
}
