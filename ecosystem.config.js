module.exports = {
    apps : [{
      name: "app",
      script: "npm run start",
      //script: "npm run build && npm run start",
      watch: true,
      env: {
        NODE_ENV: "development",
        
      },
      env_production: {
        NODE_ENV: "production",
        
      }
    }]
  }