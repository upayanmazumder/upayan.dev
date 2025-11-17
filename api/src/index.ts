import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;

app.get("/", (_req, res) => {
  res.send("API is running");
});

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: Date.now() });
});

app.get("/api/hello", (_req, res) => {
  res.json({ message: "Hello from the API" });
});

app.listen(Number(PORT), () => {
  // eslint-disable-next-line no-console
  console.log(`API server listening on port ${PORT}`);
});
