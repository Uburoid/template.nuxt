module.exports = {
    apps : [{
      name: "app",
      script: "npm run build && npm run start",
      watch: true,
      env: {
        NODE_ENV: "development",
        API_HOST: "node.ap51.tech",
        //API_PORT=
        API_PROTOCOL: "https",
        API_SUFFIX: "/api"
      },
      env_production: {
        NODE_ENV: "production",
        API_HOST: "node.ap51.tech",
        //API_PORT=
        API_PROTOCOL: "https",
        API_SUFFIX: "/api"
      }
    }]
  }