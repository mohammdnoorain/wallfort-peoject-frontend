module.exports = {
  apps : [{
    name: 'frontend-app',
    script: 'npm',
    args: 'run dev',
    cwd: '/home/azureuser/wallfort-crm/frontend',  // Replace with your frontend directory path
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    log_date_format: 'YYYY-MM-DD HH:mm:ss',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    }
  }]
};
