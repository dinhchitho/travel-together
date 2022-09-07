module.exports = {
  apps : [{
    name: 'API', // application name 
    script: 'npm', // script path to pm2 start
    // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
    args: 'run pm2', // string containing all arguments passed via CLI to script
    instances: 1, // number process of application
    autorestart: true, //auto restart if app crashes
    watch: false,
    max_memory_restart: '1G', // restart if it exceeds the amount of memory specified
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    }
  }],

// deployment
  // deploy : {
  //   production : {
  //     user : 'thodc',
  //     host : 'xx.xx.xx.xx',
  //     ref  : 'origin/master',
  //     repo : 'git@github.com:repo.git',
  //     path : '/var/www/production',
  //     'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production'
  //   }
  // }
};