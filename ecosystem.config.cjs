module.exports = {
  apps: [
    {
      name: "studyhq",
      port: "3000",
      exec_mode: "cluster",
      instances: "max",
      script: "npm",
      args: "run start",
    },
  ],
};
