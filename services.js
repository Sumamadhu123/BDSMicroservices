const { exec } = require('child_process');

const microservices = [
  {
    name: 'auth',
    path: '/home/bookdatasolutions/repos/microservices/auth',
    repo: 'git@github.com:Sumamadhu123/.git',
    branch: 'main',
    startCommand: 'npm start',
  },
];

function deployMicroservices() {
  microservices.forEach((service) => {
    console.log(`Deploying ${service.name}...`);

    // Pull the latest changes from the repository
    //execSync(`git pull origin ${service.branch}`);

    // Install dependencies
    //execSync(`cd ${service.path} && npm install`);

    // Restart the microservice
    exec(`cd ${service.path} && ${service.startCommand}`);

    console.log(`${service.name} deployed successfully!`);
  });
}

deployMicroservices();
