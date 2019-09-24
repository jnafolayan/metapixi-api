module.exports = {
  apps : [{
    name: 'metapixi',
    script: './dist/app.js',
    instances: 'max',
    autorestart: true,
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    }
  }]
};
