module.exports = {
  apps: [
    {
      name: "studyhq",
      port: "3000",
      exec_mode: "cluster",
      instances: "max",
      script: "dotenvx run -- node .output/server/index.mjs",
    },
  ],
};
