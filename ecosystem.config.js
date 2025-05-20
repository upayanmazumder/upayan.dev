module.exports = {
  apps: [
    {
      name: "frontend",
      cwd: "./app",
      script: "npm",
      args: "start",
      env: {
        NODE_ENV: "production",
      },
    },
    {
      name: "backend",
      cwd: "./api",
      script: "npm",
      args: "start",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
