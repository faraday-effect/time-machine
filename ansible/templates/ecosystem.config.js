module.exports = {
  apps: [
    {
      name: "{{ project.basename }}-server",
      script: "dist/main.js",
      cwd: "{{ dir_abs_server }}",
      autorestart: false,
      watch: false,
    }
  ]
};
